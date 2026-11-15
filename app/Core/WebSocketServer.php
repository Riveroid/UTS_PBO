<?php
declare(strict_types=1);

namespace MBG\Core;

/**
 * Class WebSocketServer
 * Server WebSocket Mandiri (Zero External Dependency) Berbasis OOP PHP 8.3.
 * Mengimplementasikan protokol RFC 6455 untuk menghubungkan smartphone Android/iOS
 * sebagai wireless gamepad controller ke game MBG secara real-time.
 */
class WebSocketServer
{
    private string $host;
    private int $port;
    /** @var resource|\Socket */
    private $masterSocket;
    /** @var array<int, resource|\Socket> */
    private array $clients = [];
    /** @var array<int, bool> */
    private array $handshakes = [];
    /** @var array<int, array> */
    private array $clientMeta = [];
    /** @var resource|\Socket|null */
    private $hostSocket = null;
    /** @var array<string, resource|\Socket|null> */
    private array $controllers = [
        'p1' => null,
        'p2' => null
    ];
    private bool $running = false;

    public function __construct(string $host = '0.0.0.0', int $port = 8088)
    {
        $this->host = $host;
        $this->port = $port;
    }

    /**
     * Mendapatkan alamat IP lokal LAN dari komputer host.
     */
    public static function getLocalIp(): string
    {
        // 1. Coba deteksi via UDP socket routing
        $sock = @socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
        if ($sock) {
            @socket_connect($sock, '8.8.8.8', 53);
            @socket_getsockname($sock, $localIp);
            @socket_close($sock);
            if (!empty($localIp) && $localIp !== '127.0.0.1' && $localIp !== '0.0.0.0') {
                return $localIp;
            }
        }

        // 2. Fallback Linux
        $out = @shell_exec('hostname -I 2>/dev/null');
        if ($out && trim($out)) {
            $parts = explode(' ', trim($out));
            if (!empty($parts[0])) return trim($parts[0]);
        }

        // 3. Fallback Windows ipconfig
        $outWin = @shell_exec('ipconfig 2>nul');
        if ($outWin && preg_match('/IPv4 Address[ .:]+([0-9.]+)/i', $outWin, $m)) {
            return $m[1];
        }

        return '127.0.0.1';
    }

    /**
     * Memulai server WebSocket loop.
     */
    public function start(): void
    {
        $this->masterSocket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        if (!$this->masterSocket) {
            throw new \RuntimeException("Gagal membuat socket: " . socket_strerror(socket_last_error()));
        }

        socket_set_option($this->masterSocket, SOL_SOCKET, SO_REUSEADDR, 1);

        if (!@socket_bind($this->masterSocket, $this->host, $this->port)) {
            throw new \RuntimeException("Gagal bind socket ke {$this->host}:{$this->port}: " . socket_strerror(socket_last_error($this->masterSocket)));
        }

        if (!@socket_listen($this->masterSocket, 10)) {
            throw new \RuntimeException("Gagal listen socket: " . socket_strerror(socket_last_error($this->masterSocket)));
        }

        $localIp = self::getLocalIp();
        $this->running = true;

        echo "========================================================\n";
        echo "  MBG: MOBILE BATTLE GOVERNMENT - WEBSOCKET CONTROLLER SERVER\n";
        echo "========================================================\n";
        echo " [OK] Server WebSocket berjalan di: ws://{$this->host}:{$this->port}\n";
        echo " [OK] Akses Komputer Lokal : ws://localhost:{$this->port}\n";
        echo " [OK] Akses Smartphone LAN : ws://{$localIp}:{$this->port}\n";
        echo " [OK] URL Controller P1    : http://{$localIp}:8000/controller.html?p=1\n";
        echo " [OK] URL Controller P2    : http://{$localIp}:8000/controller.html?p=2\n";
        echo " Tekan Ctrl + C untuk menghentikan server WebSocket.\n";
        echo "--------------------------------------------------------\n\n";

        while ($this->running) {
            $read = array_merge([$this->masterSocket], $this->clients);
            $write = null;
            $except = null;

            $changed = @socket_select($read, $write, $except, 0, 200000); // 200ms timeout
            if ($changed === false) {
                break;
            }

            // Client baru yang ingin terhubung
            if (in_array($this->masterSocket, $read, true)) {
                $newSocket = @socket_accept($this->masterSocket);
                if ($newSocket) {
                    $id = $this->getSocketId($newSocket);
                    $this->clients[$id] = $newSocket;
                    $this->handshakes[$id] = false;
                    $this->clientMeta[$id] = ['role' => 'unknown', 'player' => null];
                    socket_getpeername($newSocket, $peerIp);
                    echo "[CONNECT] Client baru terhubung dari {$peerIp} (ID: {$id})\n";
                }
                $key = array_search($this->masterSocket, $read, true);
                unset($read[$key]);
            }

            // Pesan dari client yang terhubung
            foreach ($read as $client) {
                $this->handleClientData($client);
            }
        }

        $this->stop();
    }

    /**
     * Memproses data masuk dari client.
     */
    private function handleClientData($client): void
    {
        $id = $this->getSocketId($client);
        $buffer = '';
        $bytes = @socket_recv($client, $buffer, 4096, 0);

        if ($bytes === false || $bytes === 0) {
            $this->disconnectClient($client);
            return;
        }

        // 1. Belum melakukan WebSocket Handshake (kirim HTTP 101)
        if (empty($this->handshakes[$id])) {
            if ($this->performHandshake($client, $buffer)) {
                $this->handshakes[$id] = true;
                echo "[HANDSHAKE] Handshake sukses dengan Client ID: {$id}\n";
                $this->broadcastStatus();
            } else {
                $this->disconnectClient($client);
            }
            return;
        }

        // 2. Decode Frame RFC 6455
        $frame = $this->decodeFrame($buffer);
        if ($frame === false) return;

        // Handle Close Frame (Opcode 0x8)
        if ($frame['opcode'] === 0x8) {
            $this->disconnectClient($client);
            return;
        }

        // Handle Ping Frame (Opcode 0x9) -> Balas Pong (0xA)
        if ($frame['opcode'] === 0x9) {
            $pong = $this->encodeFrame($frame['payload'], 'pong');
            @socket_write($client, $pong, strlen($pong));
            return;
        }

        // Handle Text Frame (Opcode 0x1)
        if ($frame['opcode'] === 0x1) {
            $json = @json_decode($frame['payload'], true);
            if (is_array($json)) {
                $this->handleMessage($client, $json);
            }
        }
    }

    /**
     * Melakukan HTTP Handshake WebSocket (RFC 6455).
     */
    private function performHandshake($client, string $headers): bool
    {
        if (preg_match('/Sec-WebSocket-Key:\s*([^\r\n]+)/i', $headers, $matches)) {
            $key = trim($matches[1]);
            $acceptKey = base64_encode(sha1($key . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', true));

            $upgrade = "HTTP/1.1 101 Switching Protocols\r\n" .
                       "Upgrade: websocket\r\n" .
                       "Connection: Upgrade\r\n" .
                       "Sec-WebSocket-Accept: {$acceptKey}\r\n\r\n";

            @socket_write($client, $upgrade, strlen($upgrade));
            return true;
        }

        return false;
    }

    /**
     * Decode Frame WebSocket dari client (Client frames are always masked).
     */
    private function decodeFrame(string $buffer): array|false
    {
        $len = strlen($buffer);
        if ($len < 2) return false;

        $firstByte = ord($buffer[0]);
        $secondByte = ord($buffer[1]);

        $opcode = $firstByte & 0x0F;
        $isMasked = ($secondByte & 0x80) === 0x80;
        $payloadLen = $secondByte & 0x7F;

        $offset = 2;
        if ($payloadLen === 126) {
            if ($len < 4) return false;
            $payloadLen = unpack('n', substr($buffer, 2, 2))[1];
            $offset = 4;
        } elseif ($payloadLen === 127) {
            if ($len < 10) return false;
            $payloadLen = unpack('J', substr($buffer, 2, 8))[1];
            $offset = 10;
        }

        if (!$isMasked) {
            return false;
        }

        if ($len < $offset + 4) return false;
        $mask = substr($buffer, $offset, 4);
        $offset += 4;

        $data = substr($buffer, $offset, $payloadLen);
        $unmasked = '';
        for ($i = 0; $i < strlen($data); $i++) {
            $unmasked .= $data[$i] ^ $mask[$i % 4];
        }

        return [
            'opcode' => $opcode,
            'payload' => $unmasked
        ];
    }

    /**
     * Encode Frame WebSocket untuk dikirim ke client (Server frames are unmasked).
     */
    public function encodeFrame(string $payload, string $type = 'text'): string
    {
        $b1 = 0x80 | ($type === 'pong' ? 0x0A : 0x01);
        $length = strlen($payload);

        if ($length <= 125) {
            $header = pack('CC', $b1, $length);
        } elseif ($length <= 65535) {
            $header = pack('CCn', $b1, 126, $length);
        } else {
            $header = pack('CCJ', $b1, 127, $length);
        }

        return $header . $payload;
    }

    /**
     * Mengirim pesan teks ke socket client.
     */
    public function send($client, string $message): bool
    {
        if (!is_resource($client) && !($client instanceof \Socket)) {
            return false;
        }
        $frame = $this->encodeFrame($message);
        $res = @socket_write($client, $frame, strlen($frame));
        return $res !== false;
    }

    /**
     * Memproses pesan JSON yang dikirim client (Host atau Controller).
     */
    private function handleMessage($client, array $msg): void
    {
        $id = $this->getSocketId($client);
        $type = $msg['type'] ?? '';

        // 1. Registrasi Client Role
        if ($type === 'register') {
            $role = (string) ($msg['role'] ?? 'controller'); // 'host' atau 'controller'
            $player = isset($msg['player']) ? strtolower((string) $msg['player']) : null; // 'p1' atau 'p2'

            $this->clientMeta[$id] = ['role' => $role, 'player' => $player];

            if ($role === 'host') {
                $this->hostSocket = $client;
                echo "[REGISTER] Host Browser Game Terhubung (ID: {$id})\n";
            } elseif ($role === 'controller' && in_array($player, ['p1', 'p2'], true)) {
                $this->controllers[$player] = $client;
                echo "[REGISTER] Smartphone Controller {$player} Terhubung! (ID: {$id})\n";
            }

            $this->send($client, json_encode([
                'type' => 'registered',
                'role' => $role,
                'player' => $player,
                'status' => 'success'
            ]));

            $this->broadcastStatus();
            return;
        }

        // 2. Input Gerakan atau Aksi dari Smartphone Controller
        if ($type === 'input' || $type === 'move' || $type === 'action') {
            $player = $this->clientMeta[$id]['player'] ?? ($msg['player'] ?? 'p1');
            $msg['player'] = $player;

            // Teruskan sinyal secara instan (<2ms) ke layar Game Host
            if ($this->hostSocket) {
                $this->send($this->hostSocket, json_encode($msg));
            }
            return;
        }

        // 3. Sinyal Umpan Balik Getaran / Haptic Feedback dari Host ke Smartphone
        if ($type === 'haptic' || $type === 'vibrate') {
            $targetPlayer = $msg['player'] ?? 'all';
            if ($targetPlayer === 'all') {
                if ($this->controllers['p1']) $this->send($this->controllers['p1'], json_encode($msg));
                if ($this->controllers['p2']) $this->send($this->controllers['p2'], json_encode($msg));
            } elseif (isset($this->controllers[$targetPlayer]) && $this->controllers[$targetPlayer]) {
                $this->send($this->controllers[$targetPlayer], json_encode($msg));
            }
            return;
        }

        // 4. Request Status Permintaan
        if ($type === 'get_status') {
            $this->broadcastStatus();
        }
    }

    /**
     * Menyiarkan status koneksi controller ke Host dan semua controller.
     */
    public function broadcastStatus(): void
    {
        $statusMsg = json_encode([
            'type' => 'status',
            'host_connected' => ($this->hostSocket !== null),
            'p1_connected' => ($this->controllers['p1'] !== null),
            'p2_connected' => ($this->controllers['p2'] !== null),
            'timestamp' => time()
        ]);

        foreach ($this->clients as $client) {
            $this->send($client, $statusMsg);
        }
    }

    /**
     * Memutuskan dan membersihkan client yang keluar.
     */
    private function disconnectClient($client): void
    {
        $id = $this->getSocketId($client);
        if (isset($this->clients[$id])) {
            $meta = $this->clientMeta[$id] ?? [];
            $role = $meta['role'] ?? 'unknown';
            $player = $meta['player'] ?? '';

            if ($this->hostSocket === $client) {
                $this->hostSocket = null;
                echo "[DISCONNECT] Game Host terputus.\n";
            }
            if (!empty($player) && ($this->controllers[$player] ?? null) === $client) {
                $this->controllers[$player] = null;
                echo "[DISCONNECT] Controller {$player} terputus.\n";
            }

            @socket_close($client);
            unset($this->clients[$id], $this->handshakes[$id], $this->clientMeta[$id]);
            echo "[DISCONNECT] Client ID {$id} ditutup.\n";

            $this->broadcastStatus();
        }
    }

    /**
     * Mendapatkan identifier unik integer dari socket (kompatibel PHP 8+ \Socket dan PHP 7 resource).
     *
     * @param resource|\Socket $socket
     * @return int
     */
    private function getSocketId($socket): int
    {
        return is_object($socket) ? spl_object_id($socket) : (int) $socket;
    }

    /**
     * Menghentikan server WebSocket.
     */
    public function stop(): void
    {
        $this->running = false;
        foreach ($this->clients as $client) {
            @socket_close($client);
        }
        $this->clients = [];
        if ($this->masterSocket) {
            @socket_close($this->masterSocket);
        }
        echo "[STOP] Server WebSocket telah dihentikan.\n";
    }
}


import time
from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(
            user_data_dir=r"C:\Temp\pw_profile_mbg",
            executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            headless=True,
            viewport={"width": 1200, "height": 800}
        )
        page = context.pages[0] if context.pages else context.new_page()

        # 1. Title Screen
        page.goto("http://127.0.0.1:8085/index.html")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        page.screenshot(path=r"D:\1Tugas Kuliah\Semester 3\PBO\UTS\MBG\docs\assets\screenshot_title.png")
        print("Captured screenshot_title.png")

        # 2. Character Select Screen
        page.click("button:has-text('1P VS CPU (ARCADE)')")
        time.sleep(1)
        page.screenshot(path=r"D:\1Tugas Kuliah\Semester 3\PBO\UTS\MBG\docs\assets\screenshot_select.png")
        print("Captured screenshot_select.png")

        # 3. Battle Screen
        page.click("button:has-text('MULAI PERTARUNGAN')")
        time.sleep(2)
        # Execute basic attack to display action and damage numbers
        page.keyboard.press("j")
        time.sleep(0.5)
        page.screenshot(path=r"D:\1Tugas Kuliah\Semester 3\PBO\UTS\MBG\docs\assets\screenshot_battle.png")
        print("Captured screenshot_battle.png")

        # 4. OOP Modal
        page.goto("http://127.0.0.1:8085/index.html")
        page.wait_for_load_state("networkidle")
        time.sleep(0.5)
        page.click("button:has-text('OOP SPECS')")
        time.sleep(0.5)
        page.screenshot(path=r"D:\1Tugas Kuliah\Semester 3\PBO\UTS\MBG\docs\assets\screenshot_oop_modal.png")
        print("Captured screenshot_oop_modal.png")

        # 5. Controls Modal
        page.goto("http://127.0.0.1:8085/index.html")
        page.wait_for_load_state("networkidle")
        time.sleep(0.5)
        page.click("button:has-text('KONTROL')")
        time.sleep(0.5)
        page.screenshot(path=r"D:\1Tugas Kuliah\Semester 3\PBO\UTS\MBG\docs\assets\screenshot_controls.png")
        print("Captured screenshot_controls.png")

        context.close()
        print("All screenshots successfully captured!")

if __name__ == '__main__':
    main()

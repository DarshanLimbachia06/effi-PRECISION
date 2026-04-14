import asyncio
from playwright.async_api import async_playwright
import time

async def run_demo():
    async with async_playwright() as p:
        # Launch browser - set headless=False to see the action
        browser = await p.chromium.launch(headless=False, slow_mo=500)
        
        # Create a cinematic widescreen viewport
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        
        print("🚀 Starting EXPANDED Demonstration of effiPrecision...")
        
        # 1. LANDING PAGE
        await page.goto("http://localhost:5174")
        print("➜ Stage 1: Landing Page")
        await asyncio.sleep(2)
        # Mouse movement for effect
        await page.mouse.move(500, 500)
        await asyncio.sleep(1)
        
        # 2. LOGIN FLOW
        print("➜ Stage 2: Secure Login Sequence")
        await page.click("button:has-text('LOGIN')")
        await page.wait_for_selector("text=Arbiter Access")
        await asyncio.sleep(1)
        
        await page.fill("input[placeholder='hr_manager_01']", "senior_auditor_alpha")
        await asyncio.sleep(1)
        await page.fill("input[placeholder='••••••••']", "precis0n_key_2026")
        await asyncio.sleep(1)
        
        await page.click("button:has-text('Establish Access')")
        print("➜ Access Established. Redirecting to Metrology Node...")
        await page.wait_for_selector("text=Inspection Floor")
        await asyncio.sleep(3)
        
        # 3. INSPECTION FLOOR (MAIN DASHBOARD)
        print("➜ Stage 3: Real-time Telemetry (Inspection Floor)")
        
        # Interaction: Hover over KPI cards
        await page.hover("text=Ticket Flow")
        await asyncio.sleep(1)
        await page.hover("text=PR Lead Time")
        await asyncio.sleep(1)
        
        # Feature: Force Scan (Recalibration)
        print("➜ Triggering Sensor Force Scan...")
        await page.click("button:has-text('FORCE SCAN')")
        await asyncio.sleep(5) # Wait for simulation to finish
        
        # 4. SUBJECT SELECTION
        print("➜ Stage 4: Context Switching (Switching to Riya Desai)")
        await page.select_option("select", label="Riya Desai — Staff Engineer")
        await asyncio.sleep(4)
        
        # 5. RESILIENCE SIMULATOR (LMC)
        print("➜ Stage 5: LMC Resilience Simulator")
        await page.click("button:has-text('LMC vs Trad.')")
        await asyncio.sleep(2)
        
        # Drag the "Capacity Drift" slider if possible (manual eval of selector)
        # Using evaluate to simulate slider drag smoothly
        print("➜ Simulating Organizational Capacity Drift...")
        await page.evaluate("""() => {
            const slider = document.querySelector('input[type=range]');
            if(slider) {
                slider.value = 0.2;
                slider.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }""")
        await asyncio.sleep(4)
        
        # 6. CROSS-SENSOR DUEL
        print("➜ Stage 6: Multi-Agent Duel (Benchmarking)")
        await page.click("button:has-text('Cross-Sensor Duel')")
        await asyncio.sleep(2)
        
        print("➜ Selecting Adversary: Aditya Sharma")
        await page.select_option("select:near(text='SELECT OPPONENT')", label="Aditya Sharma")
        await asyncio.sleep(3)
        # Hover over the Delta calculation
        await page.hover("text=Delta %")
        await asyncio.sleep(4)
        
        # 7. OFFICIAL PIC (CERTIFICATION)
        print("➜ Stage 7: Generating PIC Certificate")
        await page.wait_for_selector("button:has-text('Official PIC')")
        await page.click("button:has-text('Official PIC')")
        await asyncio.sleep(2)
        # Scroll down to show signing authority 
        await page.evaluate("window.scrollTo({top: 800, behavior: 'smooth'})")
        await asyncio.sleep(4)
        
        # 8. SENSOR MATRIX (DEEP DIVE)
        print("➜ Stage 8: Sensor Matrix (Traceability)")
        await page.click("button:has-text('Sensor Matrix')")
        await asyncio.sleep(1)
        await page.hover("text=GitHub") # Highlight GitHub sensor
        await asyncio.sleep(4)

        # 9. SPC ORCHESTRATOR (ROI)
        print("➜ Stage 9: SPC Orchestrator & ROI Analysis")
        await page.click("button:has-text('SPC Orchestrator')")
        await asyncio.sleep(2)
        
        print("➜ Calculating Calibration Dividend...")
        await page.evaluate("""() => {
            const sliders = document.querySelectorAll('input[type=range]');
            if(sliders.length >= 2) {
                sliders[0].value = 800; // Headcount
                sliders[0].dispatchEvent(new Event('input', { bubbles: true }));
                sliders[1].value = 28; // Attrition
                sliders[1].dispatchEvent(new Event('input', { bubbles: true }));
            }
        }""")
        await asyncio.sleep(5)
        
        # 10. ARBITER ASSISTANT (CHAT)
        print("➜ Stage 10: AI Arbiter Interaction")
        await page.click("button:has(svg.lucide-bot)")
        await asyncio.sleep(1)
        
        questions = [
            "Analyze Jira velocity for Riya.",
            "Are there any bias flags for this subject?",
            "What is the LMC status?"
        ]
        
        for q in questions:
            print(f"➜ Querying Arbiter: '{q}'")
            await page.fill("input[placeholder='Query agentic ledger...']", q)
            await page.press("input[placeholder='Query agentic ledger...']", "Enter")
            await asyncio.sleep(5) # Wait for AI reply
            
        print("✅ FULL SYSTEM DEMONSTRATION COMPLETE.")
        await asyncio.sleep(2)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run_demo())

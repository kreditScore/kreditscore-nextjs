Local setup — quick steps

1. Open PowerShell or Command Prompt and go to project root:

   cd "C:\Users\dell\Documents\BOOTCAMP\kreditscore-nextjs"

2. Start (Windows CMD):

   start-local.bat

3. Start (PowerShell, custom port):

   .\run-local.ps1 -Port 3000

4. Or run manually:

   npm install
   npm run dev

5. If browser shows connection refused:
- Ensure `npm run dev` is running and shows "started server" message.
- Check port usage: `netstat -a -n -o | findstr :3000` (PowerShell/ CMD)
- If blocked by Windows Firewall, allow `node.exe` through firewall.
- To run on a different port: `$env:PORT=3001; npm run dev` (PowerShell)

If you get errors, run `npm run dev 2>&1 | Tee-Object dev.log` and paste `dev.log` here.

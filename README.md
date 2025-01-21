
# Test it in production - https://delve-fysb.vercel.app

1. Head to the link - https://delve-fysb.vercel.app/auth

2. Login with
```
email: aliceseow@gmail.com
password: guest123
```

3. Type 'perform checks' in text area and press Enter

4. See status on whether the logged in user has MFA/RLS/PITR enabled (in this case the user logged in is aliceseow@gmail.com) so MFA is not enabled, RLS is enabled and PITR is not enabled

# Run it locally

1. Clone the repository to your local machine
```
git clone https://github.com/seowchiayi/delve.git
```
2. Install required dependencies from package.json
```
npm install
```
3. Start NextJs app
```
npm run dev
```
4. Start NodeJs backend server
```
cd api
npm run dev
```
5. Go to `http://localhost:3000`
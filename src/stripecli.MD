## Comands to install and authenticate to Stripe CLI (LINUX)

After extract the file stripe-cli.tar.gz inside the folder, execute steps on terminal -

### 1) Login
```
./stripe login
```

### 2) Listen
```
./stripe listen --forward-to http://localhost:3000/api/webhooks
```
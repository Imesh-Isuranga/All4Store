
# Full Stack E-Commerce Website - All4Store
Welcome to the Full Stack E-Commerce Website project! This repository contains the source code and instructions for setting up the Angular front-end, Java Spring Boot back-end, MySQL database, Stripe payment gateway integration, and Okta authorization.

# Prerequisites
Before you begin, ensure you have the following prerequisites installed:

- Node.js and npm: Required for the Angular front-end.
- TypeScript (tsc): Required for compiling Angular code.
- Java Development Kit (JDK): Required for the Spring Boot back-end.[ Java Installation Guild](https://phoenixnap.com/kb/install-java-windows)
- MySQL: Required for the database.
- Stripe API credentials.
- Okta developer account for authorization.

# Installation and Setup

## Front-End (Angular)

#### 1. Clone the Repository:
```
git clone https://github.com/Imesh-Isuranga/All4Store.git
```

#### 2. Navigate to the Front-End Directory:
```
cd Angular-FrontEnd/All4Store
```

#### 3. Install Node
Node is a platform that lets you run JavaScript outside of web browsers. It allows you to use JavaScript for various types of applications, not just in web pages. You can build server-side applications, command-line tools, and more using JavaScript with Node.

- Visit the Node.js Website:
Open your web browser and go to the official Node.js website: [Node.js Downloads](https://nodejs.org/download/release/v16.10.0/).

- Download the Installer:
Choose the Windows Installer (.msi) that corresponds to your system architecture (32-bit or 64-bit). Click on the download link to start downloading the installer.

- Run the Installer:
Once the installer is downloaded, locate the file and double-click it to run the Node.js installer.

- Verify the Installation:
To ensure that Node.js and npm are successfully installed, open a Command Prompt or PowerShell window:

Press Windows Key + R, type cmd, and press Enter to open the Command Prompt.
In the Command Prompt window, type the following commands one by one:
```
node --version
```
This command will display the version of Node.js installed on your system. If the installation was successful, you will see the version number.

```
npm --version
```
This command will display the version of npm (Node Package Manager) installed. If the installation was successful, you will see the version number.

Note: The version numbers for Node.js and npm may differ, and that's normal.


#### 4. Install tsc

TSC is the TypeScript compiler. It's a tool that helps convert your TypeScript code into JavaScript code, which is what the computer can run.

You can easily get TSC by using npm, which is a tool for installing software. Here's how:

- Open Command Prompt: Launch the Command Prompt on your computer. You can find it by searching for "Command Prompt" in the Windows menu.

- Install TypeScript: In the Command Prompt, type this command and press Enter:
```
npm install -g typescript@4.6.4
```

- Check the Version: To make sure TypeScript is installed, type this command in the Command Prompt:
```
tsc --version
```
If everything went well, you'll see the version number, which confirms that TypeScript is now on your computer.

#### 5. Install the Angular CLI

```
`npm install -g @angular/cli`
```


#### 6. Okta credentials

![Okta Credentials](https://raw.githubusercontent.com/Imesh-Isuranga/All4Store/main/1.jpg)


Navigate to 
```
cd Angular-FrontEnd\All4Store\src\app\config
```
open my-app-config.ts file.

Change below your for your credentials.

```
export default {
    oidc:{
        clientId:'{YourClientId}',
        issuer:'https://{YourOktaDomain}/oauth2/default',
        redirectUri:'https://localhost:4200/login/callback',
        scopes:['openid','profile','email']
    }
}
```


If you don't have Okta account please follow below link.

[Set up your app using Okta Integration](https://developer.okta.com/docs/guides/implement-grant-type/-/main/)


#### 9. Stripe credentials

![Stripe Credentials](https://raw.githubusercontent.com/Imesh-Isuranga/All4Store/main/2.jpg)

Navigate to
```
cd Spring-Boot-BackEnd\spring-boot-ecommerce\src\main\resources
```

open application.properties file.

```
stripe.key.secret = {Your_Strip_Client_Secret}
```

Navigate to
```
cd Angular-FrontEnd\All4Store\src\app\components\checkout
```

open checkout.component.spec.ts file.

```
stripe = Stripe({Your_Publishable_key});
```

#### 8. Start the Development Server:

```
npm start
```

#### The Angular application will be accessible at http://localhost:4200.


## Back-End (SpringBoot)

- Open below directory using Intellij Id or any.
```
cd Spring-Boot-BackEnd\spring-boot-ecommerce
```
- MVN Installtion
[MVN Install](https://phoenixnap.com/kb/install-maven-windows)

- Build the Spring Boot Application:
```
./mvnw clean install
```

- Run the Application:

The Spring Boot API will be accessible at http://localhost:8080.


## Database (MySQL)

- Install MySQL: Make sure you have MySQL server installed on your system.

- Navigate Below directory and run scrips using MySQL Workbench

```
cd DataBase Scripts
```

In this, I have used https instead of http because of more security.
In this repository include my own generated Generate Key and Self-Signed Certificate. So if u have any issue with https when running the application please follow the below link and replace files frontend and backend as the below links say.

[Generate Key and self-signed certificate ssl](https://github.com/darbyluv2code/fullstack-angular-and-springboot/blob/master/bonus-content/secure-https-communication/openssl-setup.md
)

[Keytool - Generate key and self-signed certificate](https://www.luv2code.com/keytool-steps)



## Acknowledgments
- Thanks to [Stripe](https://stripe.com/en-gb-us) for their payment gateway services.
- Thanks to [Okta](https://www.okta.com/) for the authorization and authentication integration.

Feel free to customize this README with more details about your project, including architecture, features, and usage examples. You can also add a "Contributing" section and any other relevant information for users and contributors to your project.


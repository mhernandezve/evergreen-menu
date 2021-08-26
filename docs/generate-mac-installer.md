# Generate MAC excutable 

Information obtained from [Application Distribution](https://github.com/electron/electron/blob/main/docs/tutorial/application-distribution.md#packaging-your-app-into-a-file)

First, we will need to install [Electron packager](https://github.com/electron/electron-packager)


```shell
npm install --save-dev electron-packager
```

The following sintax allows to generate an executable application.

```shell
npx electron-packager <sourcedir> <appname> --platform=<platform> --arch=<arch> [optional flags...]
```

For further information related with sintax and examples, please go to [Electron packager documentation](https://github.com/electron/electron-packager)

For basic executable file we could use

```shell
npx electron-packager . evergreen-app --out dist/
```

Also, it is possible to generate windows .exe file with following command.

```shell
npx electron-packager . app --platform win32 --arch x64 --out dist/
```


> **Important** Metadata of the application will be taken from `package.json` file, such as: application name, version, description, etc.

## Build a MAC installer

Once we have an application file we would generate an installer to help users to having the application installed correctly. To do so it is required to install [Electron Installer](https://github.com/electron-userland/electron-installer-dmg) using the following instruction.

```
npm i electron-installer-dmg -gshell
```

Prior command execution we have to install an aditional requirement.

```shell
brew install --cask wine-stable
```

With all prerequisites installed on our computer we have to execute following command:


```shell
electron-installer-dmg . test-app
```

There are some options for customization, for further details visit [Electron Installer Documentation](https://github.com/electron-userland/electron-installer-dmg)
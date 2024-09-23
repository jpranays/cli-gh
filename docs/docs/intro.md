---
sidebar_position: 1
---

# Introduction
---

[<u>**Cli-gh**</u>](https://www.npmjs.com/package/cli-gh) is a simple and intuitive command-line tool for managing GitHub repositories, users, issues, and pull requests. It provides secure authentication via GitHub PAT and powerful commands to make managing your GitHub workflow easier.

## Installation

Install [<u>`cli-gh`</u>](https://www.npmjs.com/package/cli-gh) using your preferred package manager.

```bash
npm install -g cli-gh
```

## Usage

After installing [<u>`cli-gh`</u>](https://www.npmjs.com/package/cli-gh), you can start using it to manage your GitHub workflow.

Here are three ways to run the `ghc` command:

### Using ghc

```bash
ghc --help
```

Run specific commands:

```bash
ghc <--command--> 
```

### Using npx

```bash
npx ghc --help
```

Run specific commands:

```bash
npx ghc <--command--> 
```

---------

### Using global Installation

To use `ghc` commands directly without `npx`, you need to link the package globally.

#### Step 1: Clone the Repository

```bash
git clone https://github.com/jpranays/cli-gh.git
```

#### Step 2: Navigate to the Project Directory

```bash
cd cli-gh
```

#### Step 3: Install Dependencies

```bash
npm install
```

#### Step 4: Link the Package Globally

```bash
npm link
```

:::info

This command creates a symbolic link in your system's global node_modules directory, allowing you to use **`ghc`** anywhere in your terminal.

:::

### Verify the Installation

Run the following command to verify that `ghc` is recognized:

```bash
ghc --help
```


---

:::warning[**Troubleshooting**]

- **Command Not Found**: If you receive a "command not found" error after global installation, ensure that your system's PATH includes the directory where global npm packages are installed.
- **Permission Issues**: You might need to run commands with `sudo` if you encounter permission errors during installation or linking.

:::

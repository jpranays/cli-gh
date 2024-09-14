---
sidebar_position: 1
---

# Introduction
---

[**Cli-gh**](https://www.npmjs.com/package/cli-gh) is a simple and intuitive command-line tool for managing GitHub repositories, users, issues, and pull requests. It provides secure authentication via GitHub PAT and powerful commands to make managing your GitHub workflow easier.

## Installation

Install [`cli-gh`](https://www.npmjs.com/package/cli-gh) using your preferred package manager.

```bash
npm install -g cli-gh
```

## Usage

After installing [`cli-gh`](https://www.npmjs.com/package/cli-gh), you can start using it to manage your GitHub workflow.

Here are two ways to run the `ghc` command:

### Using npx

```bash
npx cli-gh --help
```

Run specific commands:

```bash
npx cli-gh <--command--> 
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

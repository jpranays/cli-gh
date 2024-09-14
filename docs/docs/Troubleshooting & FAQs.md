
---

### 1. Why am I getting an "Authentication failed" error?

**Cause:**  
This error typically occurs if your GitHub credentials are incorrect or expired.

**Solution:**  
- Run the [`ghc logout`](/cli-gh/docs/commands/Authentication/#logout) command and then [`ghc login`](/cli-gh/docs/commands/Authentication/#login) again to refresh your credentials.
- Double-check your GitHub credentials and make sure they are correct.

---

### 2. Why I'm seeing command not found or ghc is not recognized?

**Cause:**  
- This error occurs when the CLI tool ghc is not properly installed, or the system cannot find the executable in the system's PATH.

**Solution:**  
- Use npm link to link the CLI tool to the system's PATH.
- Make sure the CLI tool is installed globally using the -g flag.
- Use `npx ghc <--command-->` to run the CLI tool without installing it globally.

---

### 3. How do I resolve API rate limit issues?

**Cause:**  
You might encounter rate limits when making many [unauthenticated API requests](/cli-gh/docs/commands/Authentication/#commands-that-do-not-require-login-).

**Solution:**  
To bypass this, you should log in using [`ghc login`](/cli-gh/docs/commands/Authentication/#login) to authenticate your requests. Authenticated users have a higher rate limit.

---

### 4. Can I use this tool with private repositories?

**Yes**, as long as you are authenticated and have the necessary permissions to access the private repository.

---

### 5. Why is `repo-clone` not working?

**Cause:**  
This could happen if the repository is private, or you do not have the correct access permissions.

**Solution:**  
Make sure you are logged and have access to the repository you're trying to clone also check if GIT is installed on your system.

---

### 6. How can I reset my GitHub credentials?

**Solution:**  
To reset your credentials, simply run [`ghc logout`](/cli-gh/docs/commands/Authentication/#logout) followed by [`ghc login`](/cli-gh/docs/commands/Authentication/#login).

---

### 7. I'm seeing "Not Found" when trying to access a repository. Why?

**Cause:**  
The repository you're trying to access may have been deleted, made private, or you're using the wrong repository name.

**Solution:**  
- Check if the repository exists and is public.
- If it's private, ensure you have the right permissions and are logged in with [`ghc login`](/cli-gh/docs/commands/Authentication/#login).
- Double-check the repository name and user.

---

### 8. How do I get help with a specific command?

You can get help for any command by running the `--help` flag. For example:

```bash
ghc <--command--> --help
```

This will display detailed usage instructions for the command.

---

### 9. Can I contribute to the development of this CLI?

Yes! Feel free to open an issue or a pull request on the [GitHub repo](https://github.com/jpranays/cli-gh).


---

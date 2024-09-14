
---

- ###  **`repo-list`** 
  
  Lists all GitHub repositories of the authenticated user.
  
  ```bash
  ghc repo-list 
  ```

  This command lists all the public repositories for the currently logged-in user.

  ![ghc repo-list](/gifs/repo-list.gif)


- ###  **`repo-create`** 
  
  Creates a new GitHub repository.
  
  ```bash
  ghc repo-create
  ```

  This command will prompt you to enter the necessary details (such as repository name and description) and will create a new repository in your GitHub account.

  ![ghc repo-list](/gifs/repo-create.gif)


- ###  **`repo-update`** 
 
  Updates an existing GitHub repository.
  
  ```bash
  ghc repo-update
  ```

  Use this command to update repository details like its name, description, visibility and more.

  ![ghc repo-update](/gifs/repo-update.gif)


- ###  **`repo-delete`** 

  Deletes a GitHub repository.
  
  ```bash
  ghc repo-delete
  ```

  :::danger

    **Warning:** This action is irreversible and will delete all data associated with the repository.

  :::
  :::warning

    **Note:** Make sure provied PAT has delete repository scope or admin rights to the repository.

  :::

- ###  **`repo-star`** 
 
  Stars a GitHub repository.
  
  ```bash
  ghc repo-star 
  ```

  Star a repository to show support or mark it for later reference.

  ![ghc repo-star](/gifs/repo-star.gif)


- ###  **`repo-unstar`** 
  
  Unstars a GitHub repository.
  
  ```bash
  ghc repo-unstar 
  ```

  Unstar a repository to remove it from your list of starred repositories.

  ![ghc repo-unstar](/gifs/repo-unstar.gif)

- ###  **`repo-fork`** 

  Forks a GitHub repository.
  
  ```bash
  ghc repo-fork 
  ```

  This command forks a repository to your GitHub account, allowing you to make changes independently.

  ![ghc repo-fork](/gifs/repo-fork.gif)


- ###  **`repo-traffic`**  

  Gets traffic information for a GitHub repository.
  
  ```bash
  ghc repo-traffic 
  ```

  Use this command to view traffic statistics such as page views and unique visitors for your repository.
  
  ![ghc repo-traffic](/gifs/repo-traffic.gif)


---

- ###  **`repo-clone`**  

  Clones a GitHub repository.
  
  ```bash
  ghc repo-clone 
  ```

  Clone a repository to your local machine using this command. It is ideal for downloading the code and contributing to open-source projects.

  :::warning

    **Note:** Make sure your terminal has Git installed and configured.

  :::

  ![ghc repo-clone](/gifs/repo-clone.gif)


- ###  **`repo-info`** 

  Gets detailed information about a GitHub repository.
  
  ```bash
  ghc repo-info 
  ```

  Retrieve information such as the repository’s name, description, owner, and more using this command.

  ![ghc repo-info](/gifs/repo-info.gif)


- ###  **`repo-actions`** 

  Lists GitHub Actions for a GitHub repository.
  
  ```bash
  ghc repo-actions 
  ```

  Use this command to see a list of GitHub Actions (such as CI/CD pipelines) configured for a repository.

  ![ghc repo-actions](/gifs/repo-actions.gif)

---

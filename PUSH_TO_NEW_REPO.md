# Push to a new GitHub repo

## 1. Create the new repo on GitHub

1. Go to **https://github.com/new**
2. Sign in as **jim-luman** (or whichever account you want to own the repo).
3. Set **Repository name** (e.g. `recruitment-ai` or `recruitment-platform`).
4. Choose **Public** (or Private).
5. **Do not** add a README, .gitignore, or license (you already have code).
6. Click **Create repository**.

## 2. Point this project at the new repo and push

After the repo is created, GitHub shows a URL like:
`https://github.com/jim-luman/recruitment-ai.git`

Run these in your project folder (replace the URL with yours):

```bash
cd /Users/macbook/recruitment-ai

# Use the new repo as origin (replaces Evan620/recruitment-ai)
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push main and all branches/tags
git push -u origin main
```

If you prefer to **keep** the old remote and add the new one as a second remote:

```bash
git remote add myrepo https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u myrepo main
```

Then your code will be in the new repo. Use the first option if this copy will be the one you work from; use the second if you still want to pull from Evan620’s repo later.

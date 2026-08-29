# Putting this on GitHub

The folder is a git repository with three commits already in it. You only need
to point it at a new GitHub repo and push.

## 1. Make an empty repo on GitHub

github.com → **New repository** → name it `ouredu-website`.
**Do not** tick "Add a README", "Add .gitignore" or "Choose a license" — the
folder already has them, and an initialised repo will refuse the first push.

## 2. Push

```bash
cd ouredu-website
git remote add origin https://github.com/YOUR-USERNAME/ouredu-website.git
git branch -M main
git push -u origin main
```

If it asks for a password, GitHub wants a **personal access token**, not your
account password: github.com → Settings → Developer settings → Personal access
tokens → Fine-grained tokens → Generate, with **Contents: Read and write** on
this repository.

## 3. Check it runs from a clean checkout

```bash
npm install
npm run dev
```

`node_modules` and `.next` are deliberately not in the folder — `npm install`
rebuilds them. Node 20 or newer.

## What is already set up

- `.gitignore` covers `node_modules`, `.next`, build caches, `.env*`, editor files
- `README.md` is what visitors see on the repo page
- `handoff/` holds the six documentation files
- Three commits of history, so the work reads as a progression

## If you would rather not use the command line

Use the archive **without** history instead and drag the files into GitHub's
web uploader. You lose the three commits, but the code is identical.

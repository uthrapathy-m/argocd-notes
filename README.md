# Argo CD Notes

Personal study notes and hands-on labs for **Argo CD**, from GitOps basics to production habits. Every lecture has a Markdown note (the source of truth), a generated HTML page, and lab files you can copy and run on a local cluster.

**Start here:** [KEY-POINTS.md](KEY-POINTS.md) (one-page revision) · [00 Lab setup](notes/00-lab-setup.md)

---

## Lectures

| # | Topic | Notes | Page | Lab files |
|---|---|---|---|---|
| 00 | Lab setup: k3d, Argo CD via Helm, session routine | [md](notes/00-lab-setup.md) | [html](docs/00-lab-setup.html) | – |
| 01 | What is GitOps | [md](notes/01-gitops.md) | [html](docs/01-gitops.html) | in the note (Git only) |
| 02 | Architecture and installation | [md](notes/02-architecture-install.md) | [html](docs/02-architecture-install.html) | in the note |
| 03 | CRDs and the Application CRD | [md](notes/03-application-crd.md) | [html](docs/03-application-crd.html) | [labs/03-application-crd](labs/03-application-crd) |
| 04 | Private repos, auto-sync, prune, self-heal | [md](notes/04-private-repos-sync-prune-selfheal.md) | [html](docs/04-private-repos-sync-prune-selfheal.html) | [labs/04-private-repo](labs/04-private-repo) |
| 05 | AppProjects: guardrails and RBAC | [md](notes/05-appprojects.md) | [html](docs/05-appprojects.html) | [labs/05-projects](labs/05-projects) |
| 06 | Sync phases and hooks | [md](notes/06-sync-phases-hooks.md) | [html](docs/06-sync-phases-hooks.html) | [labs/06-hooks](labs/06-hooks) |
| 07 | Sync waves | *next* | | |
| 08 | Argo CD + Helm | | | |
| 09 | App of Apps | | | |
| 10 | ApplicationSets | | | |

Each note follows the same shape: **TL;DR → concepts → hands-on lab (Expect / Why for every step) → production reality → revision kit** (cheat sheet, self-test with answers, interview questions).

---

## Repo layout

```
argocd-notes/
├── README.md            ← you are here
├── KEY-POINTS.md        ← every lecture's key ideas on one page
├── notes/               ← one Markdown note per lecture (source of truth)
├── docs/                ← generated HTML pages (don't edit by hand)
├── images/              ← hand-drawn diagrams, light + dark SVG (generated)
├── labs/                ← files you copy into your own lab repos
│   ├── 03-application-crd/
│   ├── 04-private-repo/        app1 (code + CI) and app1-config
│   ├── 05-projects/            5 repos: fe/be code, fe/be config, platform; tests/
│   └── 06-hooks/               PreSync, SyncFail, PostSync hooks + project change
└── tools/
    ├── build-html.mjs       ← regenerates docs/ from the Markdown
    ├── render-diagrams.mjs  ← regenerates images/ from tools/diagrams/specs.js
    └── diagrams/            ← diagram specs + render page
```

All links and lab commands are **relative to this repo**. Nothing points at a machine-specific path.

---

## How to use the labs

**1. Set `NOTES` once per terminal** (lab commands copy files from `$NOTES/labs/...`):
```bash
cd ~/gitops/argocd-notes        # wherever you cloned this repo
export NOTES=$PWD
```

**2. Copy a lab folder into your own workspace.** Each folder becomes its own GitHub repo; never push lab work from inside this repo:
```bash
mkdir -p ~/gitops
cp -r "$NOTES/labs/04-private-repo/app1" "$NOTES/labs/04-private-repo/app1-config" ~/gitops/
```

**3. Replace the placeholders** with your accounts. Lab files use `<GITHUB_USER>` and `<DOCKERHUB_USER>`:
```bash
GH_USER=your-github-user; DH_USER=your-dockerhub-user
grep -rlE '<GITHUB_USER>|<DOCKERHUB_USER>' ~/gitops --exclude-dir=argocd-notes --exclude-dir=.git \
  | xargs -r sed -i -e "s/<GITHUB_USER>/$GH_USER/g" -e "s/<DOCKERHUB_USER>/$DH_USER/g"
```
`--exclude-dir=argocd-notes` keeps this repo's own files untouched.

**4. Follow the lab section of the lecture note.** Each step says what a command does, what to **expect**, and **why**. Secrets (tokens, keys) are never written into files, URLs or shell history: commands use prompts, `read -rs` or the clipboard.

---

## Lab environment (short version)

| | |
|---|---|
| Cluster | k3d cluster `dev` (k3s in Docker) |
| Argo CD | Helm chart `argo/argo-cd` 9.1.9 (Argo CD v3.2), release `my-argo-cd`, namespace `argocd` |
| UI / CLI | `kubectl port-forward svc/my-argo-cd-argocd-server -n argocd 8443:443` → https://localhost:8443 |
| Apps | `kubectl port-forward ... 8081:80` |
| CI / images | GitHub Actions → Docker Hub |
| Cost | $0 |

Full setup: [notes/00-lab-setup.md](notes/00-lab-setup.md).

---

## HTML pages

`docs/` holds a styled page per note (sidebar contents, hand-drawn diagrams, copy buttons, light/dark, print to A4). Open them directly in a browser, or publish them with **GitHub Pages** (Settings → Pages → Branch `main`, folder `/docs`).

After editing any Markdown, regenerate them (Node 18+, no npm install needed):
```bash
node tools/build-html.mjs
```

## Diagrams

Diagrams are hand-drawn (rough.js, Excalidraw-style) SVGs in `images/`, one light and one dark file each. Notes embed them with `<picture>`, so GitHub and the HTML pages switch with the reader's theme. The Kalam handwriting font is embedded (subset) in every SVG.

To change one, edit its spec in `tools/diagrams/specs.js`, then:
```bash
node tools/render-diagrams.mjs     # needs Chrome or Edge + internet; writes images/*.svg
node tools/build-html.mjs
```

---

## Conventions

- **Placeholders:** `<GITHUB_USER>`, `<DOCKERHUB_USER>`, `<this repo>`.
- **Ports:** Argo CD 8443, app port-forwards 8081, k3d's Traefik owns 8080.
- **Every manifest pins its versions** (chart, image tag or digest, hook images).
- **Corrections and nuances** to commonly taught claims are in each note's *Production reality* section.

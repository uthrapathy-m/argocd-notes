/* Diagram specs, pro-docs format. Rendered to images/<key>-light.svg and images/<key>-dark.svg by
   node tools/render-diagrams.mjs
   Spec: { w, h, alt, nodes: [], edges: [], texts: [] }   (viewBox px; w = 760)
   node:  { id, x, y, w, h, label: 'Bold first line\nsmaller line', tone: 'accent'|'sky'|'sage'|'sand'|'plain',
            dash?: true, shape?: 'db', kind?: 'group' }   (group = dashed container, list it before its children)
   edge:  { from, to, label?, dash?, fs?/ts?: 'l'|'r'|'t'|'b' }  or  { pts: [[x,y],...], label?, dash? }
   text:  { x, y, t, size?, weight?, anchor?, c?: 'ink'|'muted'|'clay'|'sky'|'sage'|'sand' }
   Tones: accent = the main thing, sky = secondary, sage = outputs/results, sand = data/compute, plain = external. */
window.DIAGRAMS = {

  /* 00 · what runs where */
  'lab-environment': { w: 760, h: 400, alt: 'Your laptop runs Docker, which runs the k3d node with Argo CD and app pods plus a load balancer; the terminal and browser reach them through kubectl and a port-forward; Argo CD pulls from GitHub and pods pull images from Docker Hub.',
    nodes: [
      { id: 'laptop', kind: 'group', x: 14, y: 14, w: 732, h: 272, tone: 'plain', label: 'Your laptop' },
      { id: 'docker', kind: 'group', x: 30, y: 48, w: 440, h: 224, tone: 'sky', label: 'Docker' },
      { id: 'node', kind: 'group', x: 46, y: 80, w: 408, h: 110, tone: 'sand', label: 'k3d-dev-server-0 (k3s)' },
      { id: 'argocd', x: 62, y: 112, w: 180, h: 66, tone: 'accent', label: 'argocd pods\nAPI, repo, controller' },
      { id: 'apps', x: 258, y: 112, w: 180, h: 66, tone: 'sage', label: 'app1 pods\nyour workloads' },
      { id: 'lb', x: 62, y: 206, w: 376, h: 56, tone: 'plain', label: 'k3d-dev-serverlb\nK8s API + 8080 to Traefik' },
      { id: 'term', x: 494, y: 64, w: 236, h: 66, tone: 'plain', label: 'Terminal\nkubectl helm argocd gh' },
      { id: 'browser', x: 494, y: 160, w: 236, h: 66, tone: 'plain', label: 'Browser\nhttps://localhost:8443' },
      { id: 'gh', x: 70, y: 318, w: 240, h: 66, tone: 'plain', label: 'GitHub\nrepos + Actions CI' },
      { id: 'hub', x: 420, y: 314, w: 240, h: 70, tone: 'sand', shape: 'db', label: 'Docker Hub\nimages' }
    ],
    edges: [
      { pts: [[494, 97], [482, 97], [482, 234], [438, 234]] },
      { pts: [[62, 145], [40, 145], [40, 351], [70, 351]], label: 'pulls Git' },
      { pts: [[438, 145], [462, 145], [462, 314]] },
      { from: 'gh', to: 'hub', label: 'CI push' }
    ] },

  /* 01 · end-to-end GitOps flow */
  'gitops-flow': { w: 760, h: 310, alt: 'Developers change the app repo, whose CI publishes an image to the registry and opens a PR to the config repo; DevOps also changes the config repo; Argo CD pulls the config repo and reconciles the workloads, which pull the image.',
    nodes: [
      { id: 'dev', x: 20, y: 30, w: 150, h: 60, tone: 'plain', label: 'Developer' },
      { id: 'app', x: 230, y: 30, w: 170, h: 60, tone: 'sky', label: 'App repo\ncode + CI' },
      { id: 'reg', x: 460, y: 26, w: 170, h: 70, tone: 'sand', shape: 'db', label: 'Registry\nimages' },
      { id: 'ops', x: 20, y: 140, w: 150, h: 60, tone: 'plain', label: 'DevOps\nplatform' },
      { id: 'cfg', x: 230, y: 140, w: 170, h: 60, tone: 'sky', label: 'Config repo\nmanifests' },
      { id: 'argo', x: 460, y: 140, w: 170, h: 60, tone: 'accent', label: 'Argo CD\nin the cluster' },
      { id: 'k8s', x: 460, y: 236, w: 170, h: 60, tone: 'sage', label: 'Workloads\nKubernetes' }
    ],
    edges: [
      { from: 'dev', to: 'app', label: 'PR' },
      { from: 'app', to: 'reg', label: 'build' },
      { from: 'app', to: 'cfg', dash: true, label: 'CI bumps tag' },
      { from: 'ops', to: 'cfg', label: 'PR' },
      { from: 'cfg', to: 'argo', label: 'pulled' },
      { from: 'argo', to: 'k8s', label: 'reconcile' },
      { pts: [[630, 61], [700, 61], [700, 266], [630, 266]], label: 'pull' }
    ] },

  /* 01 · push vs pull */
  'push-vs-pull': { w: 760, h: 300, alt: 'Push model: a CI pipeline holding cluster credentials runs kubectl apply against the cluster. Pull model: CI only opens PRs to Git, and a controller inside the cluster pulls from Git and reconciles.',
    nodes: [
      { id: 'pushg', kind: 'group', x: 14, y: 14, w: 732, h: 112, tone: 'sand', label: 'Push model' },
      { id: 'ci1', x: 40, y: 50, w: 270, h: 62, tone: 'sand', label: 'CI pipeline\nholds cluster credentials' },
      { id: 'c1', x: 500, y: 50, w: 220, h: 62, tone: 'plain', label: 'Cluster' },
      { id: 'pullg', kind: 'group', x: 14, y: 142, w: 732, h: 144, tone: 'accent', label: 'Pull model (GitOps)' },
      { id: 'ci2', x: 36, y: 182, w: 170, h: 66, tone: 'sand', label: 'CI\nGit + registry only' },
      { id: 'git', x: 250, y: 182, w: 130, h: 66, tone: 'plain', label: 'Git' },
      { id: 'ag', x: 424, y: 182, w: 160, h: 66, tone: 'accent', label: 'Controller\ninside the cluster' },
      { id: 'c2', x: 624, y: 182, w: 106, h: 66, tone: 'sage', label: 'Cluster' }
    ],
    edges: [
      { from: 'ci1', to: 'c1', label: 'kubectl apply' },
      { from: 'ci2', to: 'git', label: 'PR' },
      { from: 'git', to: 'ag', label: 'pulled' },
      { from: 'ag', to: 'c2', label: 'sync' }
    ] },

  /* 02 · architecture */
  'argocd-architecture': { w: 760, h: 340, alt: 'Inside the argocd namespace, the API server is the front door for engineers and CI, the application controller compares desired and live state, the repo server clones and renders Git, Redis is a cache, and Dex, the ApplicationSet controller and notifications support them. The controller watches and applies to the Kubernetes API.',
    nodes: [
      { id: 'user', x: 20, y: 50, w: 150, h: 60, tone: 'plain', label: 'Engineer\nUI / CLI' },
      { id: 'ci', x: 20, y: 150, w: 150, h: 60, tone: 'plain', dash: true, label: 'CI\nreads status' },
      { id: 'ns', kind: 'group', x: 192, y: 14, w: 372, h: 312, tone: 'accent', label: 'argocd namespace' },
      { id: 'api', x: 210, y: 50, w: 156, h: 66, tone: 'sky', label: 'API Server\nfront door' },
      { id: 'ctrl', x: 392, y: 50, w: 156, h: 66, tone: 'accent', label: 'App Controller\ndesired vs live' },
      { id: 'redis', x: 210, y: 156, w: 156, h: 70, tone: 'sand', shape: 'db', label: 'Redis\ncache only' },
      { id: 'repo', x: 392, y: 158, w: 156, h: 66, tone: 'sky', label: 'Repo Server\nclone + render' },
      { id: 'extra', x: 210, y: 254, w: 338, h: 56, tone: 'plain', dash: true, label: 'Supporting\nDex · AppSet controller · Notifications' },
      { id: 'k8s', x: 590, y: 50, w: 150, h: 66, tone: 'sage', label: 'Kubernetes API\napp namespaces' },
      { id: 'git', x: 590, y: 156, w: 150, h: 70, tone: 'sand', shape: 'db', label: 'Git\nconfig repo' }
    ],
    edges: [
      { from: 'user', to: 'api' },
      { from: 'ci', to: 'api', dash: true },
      { from: 'api', to: 'ctrl' },
      { from: 'ctrl', to: 'repo' },
      { from: 'api', to: 'redis', dash: true },
      { from: 'repo', to: 'git', label: 'clone' },
      { from: 'ctrl', to: 'k8s', label: 'apply' }
    ] },

  /* 03 · from CRD to running app */
  'application-crd': { w: 760, h: 260, alt: 'The Application CRD defines the schema; your Application CR is an instance in the argocd namespace; the application controller watches it, asks the repo server to clone and render the Git path, then compares and syncs the destination namespace.',
    nodes: [
      { id: 'crd', x: 20, y: 30, w: 160, h: 80, tone: 'plain', label: 'CRD\nkind: Application\nthe schema' },
      { id: 'cr', x: 210, y: 30, w: 160, h: 80, tone: 'accent', label: 'Application CR\nyour YAML\nin argocd ns' },
      { id: 'ctrl', x: 400, y: 30, w: 160, h: 80, tone: 'sky', label: 'App Controller\nwatches CRs' },
      { id: 'ns', x: 590, y: 30, w: 150, h: 80, tone: 'sage', label: 'Destination\nnamespace\nDeployment, Svc' },
      { id: 'repo', x: 400, y: 168, w: 160, h: 66, tone: 'sky', label: 'Repo Server\nclone + render' },
      { id: 'git', x: 590, y: 164, w: 150, h: 72, tone: 'sand', shape: 'db', label: 'Git path\nYAML / Helm' }
    ],
    edges: [
      { from: 'crd', to: 'cr', label: 'instance' },
      { from: 'cr', to: 'ctrl' },
      { from: 'ctrl', to: 'ns', label: 'sync' },
      { from: 'ctrl', to: 'repo', label: 'asks' },
      { from: 'repo', to: 'git' }
    ] },

  /* 04 · the three automation features */
  'sync-features': { w: 760, h: 260, alt: 'A new Git commit triggers automated sync, which applies Git. A resource removed from Git is deleted from the cluster when prune is on. A live change made by hand is reverted within seconds when selfHeal is on.',
    nodes: [
      { id: 'a1', x: 20, y: 20, w: 230, h: 60, tone: 'plain', label: 'New Git commit' },
      { id: 'b1', x: 510, y: 20, w: 230, h: 60, tone: 'accent', label: 'Sync\napply Git' },
      { id: 'a2', x: 20, y: 100, w: 230, h: 60, tone: 'plain', label: 'Resource removed\nfrom Git' },
      { id: 'b2', x: 510, y: 100, w: 230, h: 60, tone: 'sand', label: 'Delete it\nfrom the cluster' },
      { id: 'a3', x: 20, y: 180, w: 230, h: 60, tone: 'plain', label: 'Live change\nby hand (kubectl)' },
      { id: 'b3', x: 510, y: 180, w: 230, h: 60, tone: 'sage', label: 'Re-apply Git\nwithin seconds' }
    ],
    edges: [
      { from: 'a1', to: 'b1', label: 'automated' },
      { from: 'a2', to: 'b2', label: 'prune: true' },
      { from: 'a3', to: 'b3', label: 'selfHeal: true' }
    ] },

  /* 05 · the four questions */
  'appproject-questions': { w: 760, h: 330, alt: 'An Application references an AppProject, which answers four questions: where from (sourceRepos), where to (destinations), what kinds (resource lists) and who operates (roles and RBAC).',
    nodes: [
      { id: 'app', x: 20, y: 128, w: 180, h: 72, tone: 'plain', label: 'Application\nproject: app1-project' },
      { id: 'proj', x: 256, y: 118, w: 190, h: 92, tone: 'accent', label: 'AppProject\napp1-project\nthe guardrail' },
      { id: 'q1', x: 540, y: 16, w: 200, h: 60, tone: 'sky', label: 'Where from?\nsourceRepos' },
      { id: 'q2', x: 540, y: 96, w: 200, h: 60, tone: 'sky', label: 'Where to?\ndestinations' },
      { id: 'q3', x: 540, y: 176, w: 200, h: 60, tone: 'sand', label: 'What kinds?\nresource lists' },
      { id: 'q4', x: 540, y: 256, w: 200, h: 60, tone: 'sage', label: 'Who operates?\nroles + RBAC' }
    ],
    edges: [
      { from: 'app', to: 'proj', label: 'checked by' },
      { from: 'proj', to: 'q1' }, { from: 'proj', to: 'q2' },
      { from: 'proj', to: 'q3' }, { from: 'proj', to: 'q4' }
    ] },

  /* 05 · the five-repo lab */
  'five-repos': { w: 760, h: 420, alt: 'Frontend and backend code repos push images to Docker Hub through CI. The platform repo defines app1-project. Each config repo feeds its Application over a deploy key; the project guards both apps, which deploy into app1-ns, where pods pull the images.',
    nodes: [
      { id: 'fec', x: 20, y: 20, w: 210, h: 56, tone: 'plain', label: 'app1-frontend\ncode + CI' },
      { id: 'bec', x: 20, y: 96, w: 210, h: 56, tone: 'plain', label: 'app1-backend\ncode + CI' },
      { id: 'plat', x: 20, y: 176, w: 210, h: 66, tone: 'plain', label: 'platform repo\nargocd-platform-config' },
      { id: 'fecfg', x: 20, y: 262, w: 210, h: 60, tone: 'plain', label: 'frontend-config\nmanifests + argo/' },
      { id: 'becfg', x: 20, y: 342, w: 210, h: 60, tone: 'plain', label: 'backend-config\nmanifests + argo/' },
      { id: 'hub', x: 300, y: 44, w: 170, h: 76, tone: 'sand', shape: 'db', label: 'Docker Hub\nimages' },
      { id: 'proj', x: 300, y: 176, w: 170, h: 66, tone: 'accent', label: 'app1-project\nAppProject' },
      { id: 'fe', x: 300, y: 262, w: 170, h: 60, tone: 'sky', label: 'app1-fe-app' },
      { id: 'be', x: 300, y: 342, w: 170, h: 60, tone: 'sky', label: 'app1-be-app' },
      { id: 'ns', x: 550, y: 200, w: 190, h: 202, tone: 'sage', label: 'app1-ns\nfrontend pods\nbackend pods' }
    ],
    edges: [
      { from: 'fec', to: 'hub', label: 'CI' },
      { from: 'bec', to: 'hub', label: 'CI' },
      { from: 'plat', to: 'proj', label: 'apply' },
      { from: 'fecfg', to: 'fe', label: 'key' },
      { from: 'becfg', to: 'be', label: 'key' },
      { from: 'proj', to: 'fe', dash: true },
      { from: 'fe', to: 'ns', ts: 'l' },
      { from: 'be', to: 'ns', ts: 'l' },
      { pts: [[470, 82], [645, 82], [645, 200]], label: 'pull' }
    ] },

  /* 06 · phases */
  'sync-phases': { w: 760, h: 270, alt: 'A sync runs PreSync, then Sync, then PostSync, then succeeds; a failure in any phase goes to SyncFail and the sync is marked Failed.',
    nodes: [
      { id: 'start', x: 20, y: 40, w: 90, h: 60, tone: 'plain', label: 'Sync\nstarts' },
      { id: 'pre', x: 135, y: 30, w: 140, h: 80, tone: 'accent', label: 'PreSync\nhooks: migrate' },
      { id: 'syn', x: 300, y: 30, w: 140, h: 80, tone: 'sky', label: 'Sync\nyour manifests' },
      { id: 'post', x: 465, y: 30, w: 140, h: 80, tone: 'sage', label: 'PostSync\nafter Healthy' },
      { id: 'ok', x: 630, y: 40, w: 110, h: 60, tone: 'sage', label: 'Succeeded' },
      { id: 'sf', x: 300, y: 180, w: 305, h: 70, tone: 'sand', label: 'SyncFail\nonly if a phase failed' },
      { id: 'bad', x: 630, y: 185, w: 110, h: 60, tone: 'plain', label: 'Failed' }
    ],
    edges: [
      { from: 'start', to: 'pre' }, { from: 'pre', to: 'syn' }, { from: 'syn', to: 'post' }, { from: 'post', to: 'ok' },
      { pts: [[205, 110], [205, 215], [300, 215]], label: 'fail', dash: true },
      { pts: [[370, 110], [370, 180]], label: 'fail', dash: true },
      { pts: [[535, 110], [535, 180]], label: 'fail', dash: true },
      { from: 'sf', to: 'bad' }
    ] },

  /* 06 · PreSync vs init container */
  'presync-vs-init': { w: 760, h: 330, alt: 'Left: a PreSync Job runs once before any manifest is applied and stops everything if it fails. Right: after the Deployment is applied, every pod runs its own init container, again on every restart.',
    nodes: [
      { id: 'gl', kind: 'group', x: 20, y: 14, w: 350, h: 300, tone: 'accent', label: 'PreSync: control plane, once' },
      { id: 'gr', kind: 'group', x: 390, y: 14, w: 350, h: 300, tone: 'sky', label: 'Init container: per pod' },
      { id: 's1', x: 45, y: 50, w: 300, h: 56, tone: 'plain', label: 'Sync starts' },
      { id: 's2', x: 45, y: 135, w: 300, h: 66, tone: 'accent', label: 'PreSync Job\nruns once; fail = stop' },
      { id: 's3', x: 45, y: 230, w: 300, h: 66, tone: 'sage', label: 'Apply manifests\nonly if the Job succeeded' },
      { id: 'd1', x: 415, y: 50, w: 300, h: 56, tone: 'sky', label: 'Deployment applied' },
      { id: 'p1', x: 415, y: 150, w: 92, h: 70, tone: 'sand', label: 'Pod 1\ninit runs' },
      { id: 'p2', x: 519, y: 150, w: 92, h: 70, tone: 'sand', label: 'Pod 2\ninit runs' },
      { id: 'p3', x: 623, y: 150, w: 92, h: 70, tone: 'sand', label: 'Pod 3\ninit runs' }
    ],
    edges: [
      { from: 's1', to: 's2' }, { from: 's2', to: 's3', label: 'ok' },
      { pts: [[461, 106], [461, 150]] }, { pts: [[565, 106], [565, 150]] }, { pts: [[669, 106], [669, 150]] }
    ],
    texts: [
      { x: 565, y: 262, t: 'and again on every restart', anchor: 'middle', c: 'muted', size: 15 },
      { x: 565, y: 286, t: 'or reschedule', anchor: 'middle', c: 'muted', size: 15 }
    ] },

  /* 06 · what the lab touches */
  'hooks-lab': { w: 760, h: 320, alt: 'The platform repo defines app1-project, which allows Jobs; the backend and frontend config repos feed their Applications over SSH; both deploy into app1-ns, where the hook Jobs also run.',
    nodes: [
      { id: 'cl', kind: 'group', x: 300, y: 14, w: 446, h: 292, tone: 'sand', label: 'k3d dev cluster' },
      { id: 'plat', x: 20, y: 30, w: 220, h: 66, tone: 'plain', label: 'argocd-platform-config\napp1-appproj.yaml' },
      { id: 'be', x: 20, y: 125, w: 220, h: 80, tone: 'plain', label: 'app1-backend-config\ndeploy, svc\npresync + syncfail' },
      { id: 'fe', x: 20, y: 228, w: 220, h: 66, tone: 'plain', label: 'app1-frontend-config\ndeploy, svc, postsync' },
      { id: 'proj', x: 330, y: 44, w: 190, h: 66, tone: 'accent', label: 'app1-project\nallows batch/Job' },
      { id: 'beapp', x: 330, y: 140, w: 190, h: 60, tone: 'sky', label: 'app1-be-app' },
      { id: 'feapp', x: 330, y: 232, w: 190, h: 60, tone: 'sky', label: 'app1-fe-app' },
      { id: 'ns', x: 562, y: 140, w: 164, h: 152, tone: 'sage', label: 'app1-ns\nbackend pods\nfrontend pod\nhook Jobs' }
    ],
    edges: [
      { from: 'plat', to: 'proj', label: 'apply' },
      { from: 'be', to: 'beapp', label: 'SSH' },
      { from: 'fe', to: 'feapp', label: 'SSH' },
      { from: 'proj', to: 'beapp', dash: true, label: 'guards' },
      { from: 'beapp', to: 'ns' },
      { from: 'feapp', to: 'ns' }
    ] }
};

# hospitalisation-back

Backend NestJS pour la gestion d'hospitalisation.

## Structure du projet

```text
hospitalisation-back/
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── package-lock.json
├── tsconfig.json
├── apps/
│   └── clinique/
│       ├── Dockerfile
│       └── src/
│           ├── app.module.ts
│           ├── main.ts
│           ├── common/
│           │   ├── decorators/
│           │   │   └── roles.decorator.ts
│           │   └── guards/
│           │       └── roles.guard.ts
│           └── modules/
│               ├── bloc/
│               │   ├── bloc.controller.ts
│               │   ├── bloc.entity.ts
│               │   ├── bloc.module.ts
│               │   ├── bloc.resolver.ts
│               │   ├── bloc.service.ts
│               │   └── planifier-bloc.input.ts
│               ├── cpa/
│               │   ├── cpa.controller.ts
│               │   ├── cpa.entity.ts
│               │   ├── cpa.module.ts
│               │   ├── cpa.resolver.ts
│               │   ├── cpa.service.ts
│               │   └── create-cpa.input.ts
│               ├── patient/
│               │   ├── dossier-patient.type.ts
│               │   ├── patient.module.ts
│               │   ├── patient.resolver.ts
│               │   └── patient.service.ts
│               ├── signature/
│               │   ├── signature.controller.ts
│               │   └── signature.module.ts
│               └── vpa/
│                   ├── create-vpa.input.ts
│                   ├── vpa.controller.ts
│                   ├── vpa.entity.ts
│                   ├── vpa.module.ts
│                   ├── vpa.resolver.ts
│                   └── vpa.service.ts
└── dist/
    ├── tsconfig.tsbuildinfo
    └── apps/
        └── clinique/
            └── src/
                ├── app.module.js
                ├── app.module.js.map
                ├── main.js
                ├── main.js.map
                ├── common/
                │   ├── decorators/
                │   │   ├── roles.decorator.js
                │   │   └── roles.decorator.js.map
                │   └── guards/
                │       ├── roles.guard.js
                │       └── roles.guard.js.map
                └── modules/
                    ├── bloc/
                    ├── cpa/
                    ├── patient/
                    ├── signature/
                    └── vpa/
```

## Notes

- Le dossier `dist/` contient les fichiers compilés JavaScript du code TypeScript présent dans `apps/`.
- Les sous-dossiers `dist/apps/clinique/src/modules/*` reprennent la même organisation que `apps/clinique/src/modules/*`.

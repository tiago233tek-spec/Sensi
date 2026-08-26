DEMENOR SENSI 2.0 — SITE INTERATIVO SEM KEY

Site público:
- Sensi: Motorola, Samsung, Xiaomi e Infinix
- HUD
- busca
- filtros
- favoritos salvos no navegador
- muitos vídeos
- player integrado
- thumbnails, títulos e descrições

Painel:
- /admin.html
- publicar vários vídeos
- escolher marca
- adicionar título, descrição, URL e thumbnail
- excluir vídeos

Configuração:
Build: npm install
Start: npm start

Environment Variables:
ADMIN_PASSWORD = sua senha do painel
SESSION_SECRET = uma sequência longa e aleatória

IMPORTANTE:
O banco SQLite é local. Em hospedagens com disco efêmero, os dados podem ser perdidos em reinícios/redeploys. Para produção, use um banco persistente (PostgreSQL ou volume persistente).

cat > README.md << 'EOF'
# 🎯 Maiden Task Manager

Application moderne de gestion de tâches avec gamification et analytics de productivité.

## ✨ Fonctionnalités

- ✅ Gestion complète des tâches (CRUD)
- 🎨 Système de priorités avec codes couleurs
- 📊 Dashboard analytique avec scores de productivité
- 🏆 Badges et gamification
- 🔐 Authentification sécurisée
- 📱 Design responsive

## 🚀 Technologies

- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Backend**: Express + tRPC
- **Database**: MySQL + Drizzle ORM
- **Auth**: Manus OAuth

## 📦 Installation

\`\`\`bash
# Installer les dépendances
pnpm install

# Configurer la base de données
pnpm db:push

# Lancer le serveur de développement
pnpm dev
\`\`\`

## 📖 Documentation

Consultez [DOCUMENTATION.md](./DOCUMENTATION.md) pour le guide complet.

## 🎨 Logo

Voir [LOGO_PROMPT.md](./LOGO_PROMPT.md) pour générer le logo de l'application.

## 📝 Licence

Développé avec ❤️ sur la plateforme Manus
EOF

git add README.md
git commit -m "Add comprehensive README"
git push

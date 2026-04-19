import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import App from "../App";
import appCss from "../styles.css?url";

// Esta rota é apenas a "casca" do app. Toda a navegação acontece dentro de <App />
// usando react-router-dom (BrowserRouter + Routes + Route).
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Jogo da Memória — Condutti" },
      { name: "description", content: "Encontre os pares e vença!" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  ssr: false,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  // Renderiza nosso App (com BrowserRouter dentro)
  return (
    <>
      <App />
      <Outlet />
    </>
  );
}

import { Route as rootRouteImport } from './routes/__root'

export interface FileRoutesByFullPath {}
export interface FileRoutesByTo {}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: never
  fileRoutesByTo: FileRoutesByTo
  to: never
  id: '__root__'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {}
}

const rootRouteChildren: RootRouteChildren = {}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

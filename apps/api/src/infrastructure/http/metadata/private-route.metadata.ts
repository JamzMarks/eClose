import { SetMetadata } from "@nestjs/common";

/** Rotas com autenticação JWT obrigatória (o restante é público). */
export const IS_PRIVATE_ROUTE_KEY = "eclose:isPrivateRoute";

export const PrivateRoute = () => SetMetadata(IS_PRIVATE_ROUTE_KEY, true);

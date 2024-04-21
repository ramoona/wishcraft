import { getServerSession as _getServerSession } from "next-auth";

import { authOptions } from "./authOptions";

export const getServerSession = () => _getServerSession(authOptions);

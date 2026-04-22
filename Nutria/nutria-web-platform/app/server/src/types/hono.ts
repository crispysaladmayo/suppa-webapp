export type AuthUser = {
  id: string;
  householdId: string;
  email: string;
};

export type HonoEnv = {
  Variables: {
    auth: AuthUser;
  };
  Bindings: Record<string, never>;
};

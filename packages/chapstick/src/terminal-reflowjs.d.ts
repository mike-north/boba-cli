declare module "terminal-reflowjs" {
  export function reflowText(
    text: string,
    options: { maxWidth: number; mode: "truncate" | "wrap" },
  ): string;
}

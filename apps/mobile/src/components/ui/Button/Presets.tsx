/**
 * Presets de botão da eClose — preferir estes nomes em ecrãs novos para manter
 * linguagem de produto alinhada (o motor visual continua em `AppButton`).
 *
 * | Preset            | Quando usar |
 * |-------------------|-------------|
 * | `PrimaryButton`   | Uma ação principal por ecrã (submeter, continuar, confirmar). |
 * | `SecondaryButton` | Alternativa forte à primária (ex.: segundo CTA de igual peso). |
 * | `OutlineButton`   | Cancelar, voltar, ou ações secundárias sem competir com o primário. |
 *
 * Variantes extra (`ghost`, combinações) → `AppButton`.
 */
import { AppButton, type AppButtonProps } from "./AppButton";

export type ButtonPresetProps = Omit<AppButtonProps, "variant">;

export function PrimaryButton(props: ButtonPresetProps) {
  return <AppButton variant="primary" {...props} />;
}

export function SecondaryButton(props: ButtonPresetProps) {
  return <AppButton variant="secondary" {...props} />;
}

export function OutlineButton(props: ButtonPresetProps) {
  return <AppButton variant="outline" {...props} />;
}

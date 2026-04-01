import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { IVenueMediaPort } from "../interfaces/venue-media.port.interface";

/**
 * Adapter remoto para microserviço de mídia (contrato alinhado ao endpoint interno esperado).
 */
@Injectable()
export class HttpVenueMediaAdapter implements IVenueMediaPort {
  async assertAndSetPrimary(venueId: string, mediaAssetId: string): Promise<void> {
    const base = process.env.MEDIA_SERVICE_URL;
    const token = process.env.MEDIA_SERVICE_INTERNAL_TOKEN;
    if (!base) {
      throw new ServiceUnavailableException("MEDIA_SERVICE_URL não configurado.");
    }
    const url = `${base.replace(/\/$/, "")}/internal/venues/${venueId}/primary-media`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ mediaAssetId }),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new ServiceUnavailableException(`Media MS falhou (${res.status}): ${t}`);
    }
  }
}

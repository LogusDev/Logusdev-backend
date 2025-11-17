// ...existing code...
/**
 * Helpers para cálculo de preço (simples, ajustável)
 */

function haversineDistance(lat1, lon1, lat2, lon2) {
  if ([lat1, lon1, lat2, lon2].some(v => v == null)) return 0;
  const toRad = v => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(2);
}

/**
 * calculateFareSimple options:
 *  - vehicleType: 'compact'|'suv'|'pickup'|'heavy' (aplica multiplicador)
 *  - serviceType: 'guincho'|'reboque'|'troca_pneu' etc (multiplicador)
 *  - surge: multiplicador por demanda
 *  - config overrides base rates
 */
function calculateFareSimple({
  lat1, lon1, lat2, lon2,
  vehicleType = 'compact',
  serviceType = 'guincho',
  surge = 1.0,
  config = {}
} = {}) {
  const defaults = {
    baseFare: 20.0,   // valor base (R$) — aumentei para ficar mais justo
    perKm: 5.0,       // R$ por km
    perMin: 0.8,      // R$ por minuto estimado
    minFare: 45.0,    // tarifa mínima
    commission: 0.18, // 18% plataforma
    avgSpeedKmH: 40
  };
  const cfg = { ...defaults, ...config };

  const vehicleMultipliers = {
    compact: 1.0,
    suv: 1.05,
    pickup: 1.1,
    heavy: 1.25
  };

  const serviceMultipliers = {
    guincho: 1.0,
    reboque: 1.1,
    troca_pneu: 0.9,
    recover: 1.2
  };

  const distanceKm = haversineDistance(lat1, lon1, lat2, lon2);
  const estimatedMinutes = Math.max(1, Math.round((distanceKm / cfg.avgSpeedKmH) * 60));

  let raw = cfg.baseFare + distanceKm * cfg.perKm + estimatedMinutes * cfg.perMin;

  const vMult = vehicleMultipliers[vehicleType] || 1.0;
  const sMult = serviceMultipliers[serviceType] || 1.0;
  raw = raw * vMult * sMult * surge;

  if (distanceKm > 50) raw = raw * 1.15;

  const fare = Math.max(cfg.minFare, Math.round(raw * 100) / 100);
  const platformFee = +(fare * cfg.commission).toFixed(2);
  const driverAmount = +(fare - platformFee).toFixed(2);

  return {
    fare,
    distanceKm,
    estimatedMinutes,
    platformFee,
    driverAmount,
    commissionPercent: cfg.commission,
    vehicleMultiplier: vMult,
    serviceMultiplier: sMult,
    usedConfig: cfg
  };
}

export { haversineDistance, calculateFareSimple };
// ...existing code...
class CCQInfor {
  constructor(
    id,
    shortName,
    name,
    ownerShortName,
    fundAssetType,
    currentNav,
    currentNavDate,
    lastedImpact,
    impact1Month,
    impact3Month,
    impact6Month,
    impactYtd,
    impact1Year,
    impact3Year,
    impact5Year,
    impactFromEstablished
  ) {
    this.id = id;
    this.shortName = shortName;
    this.name = name;
    this.ownerShortName = ownerShortName;
    this.fundAssetType = fundAssetType;
    this.currentNav = currentNav;
    this.currentNavDate = currentNavDate;
    this.lastedImpact = lastedImpact;
    this.impact1Month = impact1Month;
    this.impact3Month = impact3Month;
    this.impact6Month = impact6Month;
    this.impactYtd = impactYtd;
    this.impact1Year = impact1Year;
    this.impact3Year = impact3Year;
    this.impact5Year = impact5Year;
    this.impactFromEstablished = impactFromEstablished;

    this.customPeriodValue = null;
    this.predictImpactValue = null;
  }
  // Getter
  get getExternalInfor() {
    return this.name + " (" + this.ownerShortName + ")";
  }

  get getCurrentNavInfor() {
    return this.currentNav + " VNĐ (at " + this.currentNavDate + ")";
  }
}

class CCQInfor{
    
    constructor(id, shortName, name, ownerShortName, fundAssetType, currentNav, currentNavDate, lastedImpact, impact1Month, impact3Month, impact6Month, impactYtd, impact1Year, impact3Year, impact5Year, impactFromEstablished) {
        this.id = id;
        this.shortName = shortName;
        this.name = name;
        this.ownerShortName = ownerShortName;
        this.fundAssetType = fundAssetType;
        this.currentNav = currentNav;
        this.currentNavDate = currentNavDate;
        this.lastedImpact = addPercentCharIfNotNull(lastedImpact);
        this.impact1Month = addPercentCharIfNotNull(impact1Month);
        this.impact3Month = addPercentCharIfNotNull(impact3Month);
        this.impact6Month = addPercentCharIfNotNull(impact6Month);
        this.impactYtd = addPercentCharIfNotNull(impactYtd);
        this.impact1Year = addPercentCharIfNotNull(impact1Year);
        this.impact3Year = addPercentCharIfNotNull(impact3Year);
        this.impact5Year = addPercentCharIfNotNull(impact5Year);
        this.impactFromEstablished = addPercentCharIfNotNull(impactFromEstablished);

        this.customPeriodValue = 0;
        this.predictImpactValue = 0;
    }
    // Getter
    get getExternalInfor() {
        return this.name +" ("+this.ownerShortName+")";
    }

    get getCurrentNavInfor(){
        return this.currentNav +" VNĐ (at "+this.currentNavDate+")";
    }

}
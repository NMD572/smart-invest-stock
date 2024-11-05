class CCQInfor{

    constructor(id, shortName, name, ownerShortName, fundAssetType, currentNav) {
        this.id = id;
        this.shortName = shortName;
        this.name = name;
        this.ownerShortName = ownerShortName;
        this.fundAssetType = fundAssetType;
        this.currentNav = currentNav;
    }
    // Getter
    get getExternalInfor() {
        return this.name +" ("+this.ownerShortName+")";
    }
}
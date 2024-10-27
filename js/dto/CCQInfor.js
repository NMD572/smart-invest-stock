class CCQInfor{

    constructor(id, shortName, name, ownerShortName, fundAssetType) {
        this.id = id;
        this.shortName = shortName;
        this.name = name;
        this.ownerShortName = ownerShortName;
        this.fundAssetType = fundAssetType;
    }
    // Getter
    get getExternalInfor() {
        return this.name +" ("+this.ownerShortName+")";
    }
}
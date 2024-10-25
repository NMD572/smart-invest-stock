class CCQInfor{

    constructor(id, shortName, name, ownerShortName, fundType) {
        this.id = id;
        this.shortName = shortName;
        this.name = name;
        this.ownerShortName = ownerShortName;
        this.fundType = fundType;
    }
    // Getter
    get getExternalInfor() {
        return this.name +" ("+this.ownerShortName+")";
    }
}
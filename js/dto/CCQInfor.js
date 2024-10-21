class CCQInfor{

    constructor(id, shortName, name, ownerShortName) {
        this.id = id;
        this.shortName = shortName;
        this.name = name;
        this.ownerShortName = ownerShortName;
    }
    // Getter
    get getExternalInfor() {
        return this.name +" ("+this.ownerShortName+")";
    }
}
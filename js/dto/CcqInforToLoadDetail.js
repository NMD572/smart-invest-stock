class CcqInforToLoadDetail{

    constructor(id, shortName, code, name, ownerShortName, fundAssetType, strategy, curNav, curNavDate, closedBankInvestTimeString, tradingTimeString, listStockInCcq, listInvestGroupPercent, listAssetPercent, listFundAssetTypeNeedToCompare) {
        this.id = id;
        this.shortName = shortName;
        this.code = code;
        this.name = name;
        this.ownerShortName = ownerShortName;
        this.fundAssetType = fundAssetType;
        this.strategy = strategy;
        this.curNav = curNav;
        this.curNavDate = curNavDate;
        this.closedBankInvestTimeString = closedBankInvestTimeString;       // 14:30 28/10/2024
        this.tradingTimeString = tradingTimeString;                         // 29/10/2024
        this.listStockInCcq = listStockInCcq;
        this.listInvestGroupPercent = listInvestGroupPercent;
        this.listAssetPercent = listAssetPercent;
        this.listFundAssetTypeNeedToCompare = listFundAssetTypeNeedToCompare;
    }   
    // Getter
    get getExternalInfor() {
        // return this.name +" ("+this.ownerShortName+")";
    }
}
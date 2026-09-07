const interface = new InterfaceManager();

function addNoble(noble) {
    noble.add();
    interface.updateNoble(noble);
    interface.updateStats();
    interface.showNobleTotal(noble);
    interface.showNobleCardStack(noble);
    interface.hideNobleSelectOption(noble);
}

function removeNoble(noble) {
    noble.remove();
    interface.updateStats();
    interface.hideNobleTotal(noble);
    interface.hideNobleCardStack(noble);
    interface.showOrHideCrownCardOptions();
    interface.showNobleOption(noble);
}

function awardCrownCard(noble, crownCard) {
    let index = noble.award(crownCard);
    interface.updateNoble(noble);
    interface.updateStats();
    interface.showOrHideCrownCardOptions();
    interface.addCardToStack(noble, crownCard, index);
}

function revokeCrownCard(noble, crownCard) {
    noble.revoke(crownCard);
    interface.updateNoble(noble);
    interface.updateStats();
    interface.showOrHideCrownCardOptions();
    interface.removeCardFromStack(noble, crownCard);
}



//Make preset elements interactive






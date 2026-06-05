// Cache DOM Elements

const fileUpload = document.getElementById("file-upload");
const fileDownload = document.getElementById("file-download");

//Title
const titleDiv = document.getElementById("title");

//Sidebar Account Lists
const fixedAssetsListDiv = document.getElementById("sbl-fixed-assets");
const currentAssetsListDiv = document.getElementById("sbl-current-assets");
const longTermLiabilitiesListDiv = document.getElementById("sbl-long-term-liabilities");
const currentLiabilitiesListDiv = document.getElementById("sbl-current-liabilities");
const equityListDiv = document.getElementById("sbl-equity");
const revenuesListDiv = document.getElementById("sbl-revenues");
const expensesListDiv = document.getElementById("sbl-expenses");
const statementsListDiv = document.getElementById("sbl-statements");

//Sidebar Add Account Buttons
const addFixedAssetAccountButton = document.getElementById("aa-fixed-asset");
const addCurrentAssetAccountButton = document.getElementById("aa-current-asset");
const addLongTermLiabilityAccountButton = document.getElementById("aa-long-term-liability");
const addCurrentLiabilityAccountButton = document.getElementById("aa-current-liability");
const addEquityAccountButton = document.getElementById("aa-equity");
const addRevenueAccountButton = document.getElementById("aa-revenue");
const addExpenseAccountButton = document.getElementById("aa-expense");

//Sidebar Statement Buttons
const trialBalanceButton = document.getElementById("sbsb-trial-balance");
const incomeStatementButton = document.getElementById("sbsb-income-statement");
const balanceSheetButton = document.getElementById("sbsb-balance-sheet");

//Main Content Div
const contentWrapperDiv = document.getElementById("content-wrapper");
const contentDiv = document.getElementById("content");

//General Journal
const generalJournalDiv = document.getElementById("general-journal");
const generalJournalRowZeroDiv = document.getElementById("gj-row-zero");
//New Row
const newRowDiv = document.getElementById("gj-new-row");
const newRowDateDiv = document.getElementById("gj-nr-date");
const newRowAccountDiv = document.getElementById("gj-nr-account");
const newRowNoteDiv = document.getElementById("gj-nr-note");
const newRowDebitDiv = document.getElementById("gj-nr-debit");
const newRowCreditDiv = document.getElementById("gj-nr-credit");
//Comment
const generalJournalCommentDiv = document.getElementById("gj-comment");

//Trial Balance
const trialBalanceDiv = document.getElementById("trial-balance");
const trialBalanceTableDiv = document.getElementById("tb-table");
const trialBalanceTotalDebitDiv = document.getElementById("tb-total-debit");
const trialBalanceTotalCreditDiv = document.getElementById("tb-total-credit");

//Income Statement
const incomeStatementDiv = document.getElementById("income-statement");
const incomeStatementRevenueTableDiv = document.getElementById("is-rev");
const incomeStatementTotalRevenueDiv = document.getElementById("is-rev-total");
const incomeStatementExpenseTableDiv = document.getElementById("is-exp");
const incomeStatementTotalExpenditureDiv = document.getElementById("is-exp-total");
const incomeStatementNetProfitDiv = document.getElementById("is-total");
const incomeStatementNetProfitLabelDiv = document.getElementById("is-total-label");

//Balance Sheet
const balanceSheetDiv = document.getElementById("balance-sheet");
const balanceSheetFixedAssetsTableDiv = document.getElementById("bs-fa");
const balanceSheetFixedAssetsTotalDiv = document.getElementById("bs-fa-total");
const balanceSheetCurrentAssetsTableDiv = document.getElementById("bs-ca");
const balanceSheetCurrentAssetsTotalDiv = document.getElementById("bs-ca-total");
const balanceSheetAssetsTotalDiv = document.getElementById("bs-a-total");

const balanceSheetLongTermLiabilitiesTableDiv = document.getElementById("bs-ltl");
const balanceSheetLongTermLiabilitiesTotalDiv = document.getElementById("bs-ltl-total");
const balanceSheetCurrentLiabilitiesTableDiv = document.getElementById("bs-cl");
const balanceSheetCurrentLiabilitiesTotalDiv = document.getElementById("bs-cl-total");
const balanceSheetEquityTableDiv = document.getElementById("bs-eq");
const balanceSheetProfitDiv = document.getElementById("bs-profit");
const balanceSheetProfitLabelDiv = document.getElementById("bs-profit-label");
const balanceSheetEquityTotalDiv = document.getElementById("bs-eq-total");
const balanceSheetLiabilitiesAndEquityTotalDiv = document.getElementById("bs-lae-total");

//Variables

var title = "Double Entry Accounts";

//Lists of Accounts
var fixedAssetAccounts = [];
var currentAssetAccounts = [];
var longTermLiabilityAccounts = [];
var currentLiabilityAccounts = [];
var equityAccounts = [];
var revenueAccounts = [];
var expenseAccounts = [];
var generalLedger = [];
const reservedAccountIDs = ["ProfitandLoss", "Balanceb/f"];

//General Journal (List of Transactions)
var generalJournal = [];
var latestTransaction = null;

//Tracks whether the editable row in the DOM is for debit
var addingDebitRow = true;

//Trial Balance
var trialBalance = {};
trialBalance.debits = 0;
trialBalance.credits = 0;

//Income Statement
var incomeStatement = {};
incomeStatement.revenue = 0;
incomeStatement.expenditure = 0;
incomeStatement.profit = 0;

//Balance Sheet
var balanceSheet = {};
balanceSheet.fixedAssets = 0;
balanceSheet.currentAssets = 0;
balanceSheet.longTermLiabilities = 0;
balanceSheet.currentLiabilities = 0;
balanceSheet.openingEquity = 0;
balanceSheet.closingEquity = 0;
balanceSheet.totalAssets = 0;
balanceSheet.totalLiabilitiesAndEquity = 0;

















//Interface Functions

//Changing Title
function titleClicked(button) {
    console.log("You clicked?");
    titleDiv.contentEditable = true;
    titleDiv.focus();
}
function titleBlur(button) {
    titleDiv.contentEditable = false;
    titleDiv.innerText = title;
}
function titleKeyPress(button, event) {
    if (event.key == "Enter") {
        var newTitle = button.innerText.trim();
        setTitle(newTitle);
        titleDiv.contentEditable = false;
    } else if (!isSafeChar(event.key)) {
        //Prevent entry of unsafe characters
        event.preventDefault();
    }
}

//Uploading CSV
function importAccounts() {
    fileUpload.value = "";
    fileUpload.click();
}
function importFile() {
    var file = fileUpload.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            parseCSV(reader.result);
            viewGeneralJournal();
        }
        reader.readAsText(file);
    }
}

function exportAccounts() {
    var href = exportFile(writeCSV());
    fileDownload.href = href;
    fileDownload.download = toID(title)+".csv";
    fileDownload.click();
}

function exportNextPeriod() {
    var href = exportFile(writeNextPeriodCSV());
    fileDownload.href = href;
    fileDownload.download = toID(title)+" (Continued).csv";
    fileDownload.click();
}

var exportedFileHRef = null;
function exportFile(text) {
    var blob = new Blob([text], {type:'text/plain'});
    if (exportedFileHRef != null) {
        window.URL.revokeObjectURL(exportedFileHRef);
    }
    exportedFileHRef = window.URL.createObjectURL(blob);
    return exportedFileHRef;
}

//Toggle Sidebar Header
function sidebarToggle(header) {
    const list = header.nextElementSibling;
    if (list.style.display == "none") {
        list.style.display = "block";
        header.firstElementChild.innerHTML = "▼";
    } else {
        list.style.display = "none";
        header.firstElementChild.innerHTML = "►";
    }
}

//Adding New Account
//Button Clicked
function addAccountClicked(button) {
    button.innerHTML = "";
    button.contentEditable = true;
    button.focus();
}
//Button Lost Focus
function addAccountAbort(button) {
    button.innerHTML = "Add account..."
    button.contentEditable = false;
}
//Key Pressed
function addAccountKeyPress(button, event) {
    if (event.key == "Enter") {
        //Attempt to create new account
        var accountName = button.innerText.trim();
        var accountID = toID(accountName);
        var accountType = button.id.substring(3);
        if (isAccountNameValid(accountName)) {
            addAccount(accountName, accountID, accountType);
            button.contentEditable = false;
        } else {
            event.preventDefault();
        }
    } else if (!isSafeChar(event.key)) {
        //Prevent entry of unsafe characters
        event.preventDefault();
    }
}


//Adding New Row to the General Journal
//Key Pressed (Submit on Enter Key)
function newRowKeyPress(div, event) {
    if (event.key == "Enter") {
        div.blur();
        if (addingDebitRow) {
            console.log("Time to add a Debit Row!");
            var transaction = validateDebitRow();
            if (transaction != null) {
                if (transaction.type == 0) {
                    addDebitRow(transaction, true);
                } else {
                    balanceAccounts(transaction, true);
                }
            }
        } else {
            console.log("Time to add a Credit Row!");
            var valid = validateCreditRow();
            if (valid) {
                addCreditRow(latestTransaction, true);
            }
        }
        event.preventDefault();
    }
}
//Validate New Row inputs & display appropriate error messages
function validateDebitRow() {
    //Validate Date
    var date;
    dateText = newRowDateDiv.innerText.trim();
    if ((dateText == "" || dateText == "\"") && latestTransaction != null) {
        //Empty date means same as last entry
        date = latestTransaction.date;
    } else {
        date = toPositiveInteger(dateText);
        if (date == -1) {
            generalJournalCommentDiv.innerText = "Date must be a positive whole number";
            newRowDateDiv.focus();
            return null;
        }
        if (latestTransaction != null) {
            if (date < latestTransaction.date) {
                generalJournalCommentDiv.innerText = "Entries must be added in chronological order";
                newRowDateDiv.focus();
                return null;
            }
        }
    }
    //Validate Account
    var accountName = newRowAccountDiv.innerText.trim();
    if (accountName == "Accounts Balanced" && newRowNoteDiv.innerText.trim() == "" && newRowDebitDiv.innerText.trim() == "") {
        let transaction = {};
        transaction.date = date;
        transaction.type = 1;
        return transaction;
    }
    var account = findAccountByName(accountName);
    if (account == null) {
        generalJournalCommentDiv.innerText = "Account \""+accountName+"\" does not exist";
        newRowAccountDiv.focus();
        return null;
    }
    //Validate Note
    var note = newRowNoteDiv.innerText.trim();
    if (note == "\"") {
        if (latestTransaction == null) {
            generalJournalCommentDiv.innerText = "Cannot copy previous note; no previous entry exists";
            newRowNoteDiv.focus();
            return null;
        } else {
            if (latestTransaction.note == "") {
                generalJournalCommentDiv.innerText = "Cannot copy previous note; previous entry has no note";
                newRowNoteDiv.focus();
                return null;
            } else {
                note = latestEntryNote;
            }
        }
    } else if (!isStringSanitised(note)) {
        generalJournalCommentDiv.innerText = "Note contains invalid characters";
        newRowNoteDiv.focus();
        return null;
    }
    //Validate Debits
    var debits = toPositiveInteger(newRowDebitDiv.innerText.trim());
    if (debits == -1) {
        generalJournalCommentDiv.innerText = "Debits must be a positive whole number";
        newRowDebitDiv.focus();
        return null;
    }
    let transaction = {};
    transaction.date = date;
    transaction.type = 0;
    transaction.debitAccountName = accountName;
    transaction.creditAccountName = null;
    transaction.note = note;
    transaction.debits = debits;
    return transaction;
}

function validateCreditRow() {
    //Only need to validate account name
    var accountName = newRowAccountDiv.innerText.trim();
    var account = findAccountByName(accountName);
    if (account == null) {
        generalJournalCommentDiv.innerText = "Account \""+accountName+"\" does not exist";
        newRowAccountDiv.focus();
        return false;
    }
    latestTransaction.creditAccountName = accountName;
    return true;
}













//Accounting functions


//Reset everything
function resetLedger() {
    console.log("Resetting entire ledger...");
    setTitle("Double Entry Accounts");
    fixedAssetAccounts = [];
    currentAssetAccounts = [];
    longTermLiabilityAccounts = [];
    currentLiabilityAccounts = [];
    equityAccounts = [];
    revenueAccounts = [];
    expenseAccounts = [];
    generalLedger = [];

    generalJournal = [];
    latestTransaction = null;
    addingDebitRow = true;

    trialBalance.debits = 0;
    trialBalance.credits = 0;

    incomeStatement.revenue = 0;
    incomeStatement.expenditure = 0;
    incomeStatement.profit = 0;
    resetDOM();
}

function setTitle(newTitle) {
    title = newTitle;
    titleDiv.innerText = newTitle;
}

//Add new account to General Ledger
function addAccount(accountName, accountID, accountType) {
    //Make account object
    var account = {};
    account.name = accountName;
    account.id = accountID;
    account.type = accountType;
    account.transactionTable = [];
    account.transactionTable.push([0, 0]); //Row zero
    account.transactionTable.push([null, null]); //Buffer row
    account.balance = 0;
    account.debitsSinceLastBalance = 0;
    account.creditsSinceLastBalance = 0;
    var ledgerIndex = findAccountIndex(account, generalLedger);
    generalLedger.splice(ledgerIndex, 0, account);
    
    //Categorise account
    var accountCategory;
    if (accountType == "fixed-asset") {
        accountCategory = fixedAssetAccounts;
    } else if (accountType == "current-asset") {
        accountCategory = currentAssetAccounts;
    } else if (accountType == "long-term-liability") {
        accountCategory = longTermLiabilityAccounts;
    } else if (accountType == "current-liability") {
        accountCategory = currentLiabilityAccounts;
    } else if (accountType == "equity") {
        accountCategory = equityAccounts;
    } else if (accountType == "revenue") {
        accountCategory = revenueAccounts;
    } else if (accountType == "expense") {
        accountCategory = expenseAccounts;
    }
    var categoryIndex = findAccountIndex(account, accountCategory);
    accountCategory.splice(categoryIndex, 0, account);

    //Update DOM
    addAccountToDOM(account, ledgerIndex, categoryIndex);
    addRowToAccountDiv(account);
}

//Add debit half of a transaction to General Journal
function addDebitRow(transaction, inputFromUser) {
    //Update variables
    var hasNote = (transaction.note != "");
    var isDebitEntry = true;
    var isNewDate = true;
    var hasRepeatedNote = false;
    if (latestTransaction != null) {
        isNewDate = (transaction.date != latestTransaction.date);
        hasRepeatedNote = ((transaction.note == latestTransaction.note) && hasNote);
    }
    latestTransaction = transaction;

    //Update DOM
    addRowToGeneralJournalDiv(transaction, isNewDate, isDebitEntry, hasNote, hasRepeatedNote, inputFromUser);
}

//Add credit half of a transaction to General Journal (also updates accounts)
function addCreditRow(transaction, inputFromUser) {
    //Add transaction to General Journal
    generalJournal.push(transaction);

    //Update affected accounts
    var accountDebited = findAccountByName(transaction.debitAccountName);
    var accountCredited = findAccountByName(transaction.creditAccountName);
    addRowToAccount(accountDebited, transaction, true);
    addRowToAccount(accountCredited, transaction, false);
    updateStatements(accountDebited);
    updateStatements(accountCredited);

    //Variables
    var isNewDate = false;
    var isDebitEntry = false;
    var hasNote = (transaction.note != "");
    var hasRepeatedNote = hasNote; //Notes on credit rows are always repeats

    //Update DOM
    addRowToGeneralJournalDiv(transaction, isNewDate, isDebitEntry, hasNote, hasRepeatedNote, inputFromUser);
}

//Add transaction to account
function addRowToAccount(account, transaction, isDebitEntry) {
    var transactionTable = account.transactionTable;
    var column = (isDebitEntry) ? 0 : 1;
    var row = transactionTable.length - 1;
    while(transactionTable[row-1][column] == null) {
        row -= 1;
    }
    if (row == transactionTable.length - 1) {
        transactionTable.push([null, null]);
        addRowToAccountDiv(account);
    }
    transactionTable[row][column] = transaction;
    
    //Update Balance
    if (isDebitEntry) {
        account.balance += transaction.debits;
        account.debitsSinceLastBalance += transaction.debits;
    } else {
        account.balance -= transaction.debits;
        account.creditsSinceLastBalance += transaction.debits;
    }
    //Update DOM
    var details = isDebitEntry ? transaction.creditAccountName : transaction.debitAccountName;
    if (transaction.note != "") {
        details += " ("+transaction.note+")";
    }
    updateAccountDivEntry(account, row, column, transaction.date, details, transaction.debits);
    updateAccountBalanceDiv(account);
}

function balanceAccount(account, date) {
    var balance = account.balance;
    var transactionTable = account.transactionTable;
    var latestRow = transactionTable[transactionTable.length-1];

    //Don't do anything if there isn't anything to balance
    if (account.debitsSinceLastBalance == 0 && account.creditsSinceLastBalance == 0) {
        return;
    }

    var row = transactionTable.length-2;
    var col;
    var absoluteBalance = (balance > 0) ? balance : (-balance);
    var totalDebits = account.debitsSinceLastBalance;
    var totalCredits = account.creditsSinceLastBalance;
    var total = (balance > 0) ? totalDebits : totalCredits;
    //Balance Carried Down
    if (account.balance != 0) {
        col = (account.balance > 0) ? 1 : 0;
        if (transactionTable[row][col] != null) {
            row += 1;
            transactionTable.push([null, null]);
            addRowToAccountDiv(account);
        }
        transactionTable[row][col] = {}; //Placeholder
        updateAccountDivEntry(account, row, col, date, "Balance c/d", absoluteBalance);
    }
    //Replace buffer row with total
    transactionTable[transactionTable.length-1][0] = {};
    transactionTable[transactionTable.length-1][1] = {};
    setLastAccountRowDivToTotal(account,total);
    //Balance Brought Forward
    if (account.balance != 0) {
        col = (account.balance > 0) ? 0 : 1;
        //Add row for balance, and new buffer row
        transactionTable.push([null, null]);
        transactionTable.push([null, null]);
        addRowToAccountDiv(account);
        addRowToAccountDiv(account);
        row = transactionTable.length - 2;
        transactionTable[row][col] = {}; //Placeholder
        updateAccountDivEntry(account, row, col, date, "Balance b/f", absoluteBalance);
    }
    account.debitsSinceLastBalance = (balance > 0) ? balance : 0;
    account.creditsSinceLastBalance = (balance < 0) ? (-balance) : 0;
}

function balanceAccounts(transaction, inputFromUser) {
    generalJournal.push(transaction);
    for (var account of generalLedger) {
        balanceAccount(account, transaction.date);
    }
    //DOM
    addTotalRowToGeneralJournalDiv(transaction.date, "Accounts Balanced", inputFromUser);
}

//Update all Statements affected by an account
function updateStatements(account) {
    updateTrialBalanceEntry(account);
    if (account.type == "revenue" || account.type == "expense") {
        updateIncomeStatementEntry(account);
    } else {
        updateBalanceSheetEntry(account);
    }
}

//Update Trial Balance entry for a particular account
function updateTrialBalanceEntry(account) {
    //Recalculate Total
    updateTrialBalanceTotal();
    //Update DOM
    updateTrialBalanceDivEntry(account);
}

//Recalculate Trial Balance totals
function updateTrialBalanceTotal() {
    var totalDebits = 0;
    var totalCredits = 0;
    for (var account of generalLedger) {
        if (account.balance > 0) {
            totalDebits += account.balance;
        } else {
            totalCredits -= account.balance;
        }
    }
    if (totalDebits != totalCredits) {
        console.log("ERROR: Total debits ("+totalDebits+") do not equal total credits ("+totalCredits+")");
    }
    trialBalance.debits = totalDebits;
    trialBalance.credits = totalCredits;
    updateTrialBalanceDivTotal();
}

//Update Income Statement entry for a particular account
function updateIncomeStatementEntry(account) {
    //Recalculate Total
    updateIncomeStatementTotals();
    //Update Balance Sheet Accordingly
    updateBalanceSheetTotals();
    //Update DOM
    updateIncomeStatementDivEntry(account);
}

//Recalculate Income Statement totals
function updateIncomeStatementTotals() {
    //Revenues are credit
    incomeStatement.revenue = -addAccountBalances(revenueAccounts);
    //Expenditures are debit
    incomeStatement.expenditure = addAccountBalances(expenseAccounts);
    incomeStatement.profit = incomeStatement.revenue - incomeStatement.expenditure;
    updateIncomeStatementDivTotals();
}

function addAccountBalances(accountList) {
    var balance = 0;
    for (var account of accountList) {
        balance += account.balance;
    }
    return balance;
}

function updateBalanceSheetEntry(account) {
    //Recalculate Totals
    updateBalanceSheetTotals();
    //Update DOM
    updateBalanceSheetDivEntry(account);
}

function updateBalanceSheetTotals() {
    //Assets are debit
    balanceSheet.fixedAssets = addAccountBalances(fixedAssetAccounts);
    balanceSheet.currentAssets = addAccountBalances(currentAssetAccounts);
    balanceSheet.totalAssets = balanceSheet.fixedAssets + balanceSheet.currentAssets;
    //Liabilities and Equity are credit
    balanceSheet.longTermLiabilities = -addAccountBalances(longTermLiabilityAccounts);
    balanceSheet.currentLiabilities = -addAccountBalances(currentLiabilityAccounts);
    balanceSheet.openingEquity = -addAccountBalances(equityAccounts);
    balanceSheet.closingEquity = balanceSheet.openingEquity + incomeStatement.profit;
    balanceSheet.totalLiabilitiesAndEquity = balanceSheet.longTermLiabilities + balanceSheet.currentLiabilities + balanceSheet.closingEquity;
    updateBalanceSheetDivTotals();
}





























//DOM Functions

function resetDOM() {
    //Sidebar buttons
    fixedAssetsListDiv.innerHTML = "";
    currentAssetsListDiv.innerHTML = "";
    longTermLiabilitiesListDiv.innerHTML = "";
    currentLiabilitiesListDiv.innerHTML = "";
    equityListDiv.innerHTML = "";
    revenuesListDiv.innerHTML = "";
    expensesListDiv.innerHTML = "";
    //Accounts
    removeChildrenWithIDPrefix(contentDiv, "acc-");
    //General Journal
    while (generalJournalRowZeroDiv.nextElementSibling.id != "gj-new-row") {
        generalJournalRowZeroDiv.nextElementSibling.remove();
    }
    resetGeneralJournalNewRowDiv(true, 0, false, false);
    //Trial Balance
    trialBalanceTotalDebitDiv.innerText = "";
    trialBalanceTotalCreditDiv.innerText = "";
    removeChildrenWithIDPrefix(trialBalanceTableDiv, "tb-acc-");
    
    //Income Statement
    incomeStatementRevenueTableDiv.style.display = "none";
    removeChildrenWithIDPrefix(incomeStatementRevenueTableDiv, "is-acc-");
    incomeStatementExpenseTableDiv.style.display = "none";
    removeChildrenWithIDPrefix(incomeStatementExpenseTableDiv, "is-acc-");
    incomeStatementTotalRevenueDiv.innerText = "";
    incomeStatementTotalExpenditureDiv.innerText = "";
    incomeStatementNetProfitDiv.innerText = "";
    incomeStatementNetProfitLabelDiv.innerText = "Net Profit";
    
    //Balance Sheet
    //Assets
    balanceSheetFixedAssetsTableDiv.style.display = "none";
    balanceSheetFixedAssetsTotalDiv.innerText = "";
    removeChildrenWithIDPrefix(balanceSheetFixedAssetsTableDiv, "bs-acc-");
    balanceSheetCurrentAssetsTableDiv.style.display = "none";
    balanceSheetCurrentAssetsTotalDiv.innerText = "";
    removeChildrenWithIDPrefix(balanceSheetCurrentAssetsTableDiv, "bs-acc-");
    balanceSheetAssetsTotalDiv.innerText = "";
    //Libailities & Equity
    balanceSheetLongTermLiabilitiesTableDiv.style.display = "none";
    balanceSheetLongTermLiabilitiesTotalDiv.innerText = "";
    removeChildrenWithIDPrefix(balanceSheetLongTermLiabilitiesTableDiv, "bs-acc-");
    balanceSheetCurrentLiabilitiesTableDiv.style.display = "none";
    balanceSheetCurrentLiabilitiesTotalDiv.innerText = "";
    removeChildrenWithIDPrefix(balanceSheetCurrentLiabilitiesTableDiv, "bs-acc-");
    balanceSheetEquityTableDiv.style.display = "none";
    balanceSheetEquityTotalDiv.innerText = "";
    removeChildrenWithIDPrefix(balanceSheetEquityTableDiv, "bs-acc-");
    balanceSheetLiabilitiesAndEquityTotalDiv.innerText = "";

    viewGeneralJournal();
}

function viewGeneralJournal() {
    hideAccounts();
    deselectButtons();
    generalJournalDiv.style.display = "block";
}

function viewTrialBalance() {
    hideAccounts();
    deselectButtons();
    trialBalanceButton.className = "selected";
    trialBalanceDiv.style.display = "block";
}

function viewIncomeStatement() {
    hideAccounts();
    deselectButtons();
    incomeStatementButton.className = "selected";
    incomeStatementDiv.style.display = "block";
}

function viewBalanceSheet() {
    hideAccounts();
    deselectButtons();
    balanceSheetButton.className = "selected";
    balanceSheetDiv.style.display = "block";
}

function viewAccount(button) {
    //Unhighlight and hide all accounts
    hideAccounts();
    deselectButtons();
    var accountID = button.id.substring(4);
    //Highlight Button
    var accountButtonID = "sbb-"+accountID;
    var accountButton = document.getElementById(accountButtonID);
    accountButton.className = "selected";
    //View Account
    var accountDivID = "acc-"+accountID;
    var accountDiv = document.getElementById(accountDivID);
    accountDiv.style.display = "block";
}

function hideAccounts() {
    var children = contentDiv.children;
    for (var child of children) {
        child.style.display = "none";
    }
}

function deselectButtons() {
    deselectChildren(fixedAssetsListDiv);
    deselectChildren(currentAssetsListDiv);
    deselectChildren(longTermLiabilitiesListDiv);
    deselectChildren(currentLiabilitiesListDiv);
    deselectChildren(equityListDiv);
    deselectChildren(revenuesListDiv);
    deselectChildren(expensesListDiv);
    deselectChildren(statementsListDiv);
}

function deselectChildren(element) {
    for (var child of element.children) {
        child.className = "";
    }
}

function addAccountToDOM(account, ledgerIndex, categoryIndex) {
    //Make account div
    let accountDiv = document.createElement("div");
    let accountTable = document.createElement("table");
    accountTable.className = "account";
    
    //Column Groups
    let colGroup = document.createElement("colgroup");
    //Debit Date
    let debitDateCol = document.createElement("col");
    debitDateCol.className = "date";
    colGroup.appendChild(debitDateCol);
    //Debit Details
    let debitDetailsCol = document.createElement("col");
    debitDetailsCol.className = "details";
    colGroup.appendChild(debitDetailsCol);
    //Debit
    let debitCol = document.createElement("col");
    debitCol.className = "debit";
    colGroup.appendChild(debitCol);
    //Credit Date
    let creditDateCol = document.createElement("col");
    creditDateCol.className = "date";
    colGroup.appendChild(creditDateCol);
    //Credit Details
    let creditDetailsCol = document.createElement("col");
    creditDetailsCol.className = "details";
    colGroup.appendChild(creditDetailsCol);
    let creditCol = document.createElement("col");
    creditCol.className = "credit";
    colGroup.appendChild(creditCol);

    accountTable.appendChild(colGroup);

    //Head
    let tableHead = document.createElement("thead");
    
    //Title
    let titleRow = document.createElement("tr");
    //let titleMargin = document.createElement("th");
    //titleRow.appendChild(titleMargin);
    let tableTitle = document.createElement("th");
    tableTitle.colSpan = 6; //5
    tableTitle.className = "title";
    tableTitle.innerText = account.name;
    titleRow.appendChild(tableTitle);

    tableHead.appendChild(titleRow);
    
    //Headings
    let headingRow = document.createElement("tr");
    //Debit
    let debitDateHeading = document.createElement("th");
    debitDateHeading.innerText = "Date";
    headingRow.appendChild(debitDateHeading);
    let debitDetailsHeading = document.createElement("th");
    debitDetailsHeading.innerText = "Details";
    headingRow.appendChild(debitDetailsHeading);
    let debitHeading = document.createElement("th");
    debitHeading.innerText = "£";
    debitHeading.className = "t";
    headingRow.appendChild(debitHeading);
    //Credit
    let creditDateHeading = document.createElement("th");
    creditDateHeading.innerText = "Date";
    headingRow.appendChild(creditDateHeading);
    let creditDetailsHeading = document.createElement("th");
    creditDetailsHeading.innerText = "Details";
    headingRow.appendChild(creditDetailsHeading);
    let creditHeading = document.createElement("th");
    creditHeading.innerText = "£";
    headingRow.appendChild(creditHeading);
    
    tableHead.appendChild(headingRow);

    accountTable.appendChild(tableHead);

    //Table Body
    let tableBody = document.createElement("tbody");
    tableBody.id = "acc-tb-"+account.id;
    
    //Row Zero
    let rowZero = document.createElement("tr");
    let rz1 = document.createElement("td");
    let rz2 = document.createElement("td");
    let rz3 = document.createElement("td");
    rz3.className = "t";
    let rz4 = document.createElement("td");
    let rz5 = document.createElement("td");
    let rz6 = document.createElement("td");
    rowZero.appendChild(rz1);
    rowZero.appendChild(rz2);
    rowZero.appendChild(rz3);
    rowZero.appendChild(rz4);
    rowZero.appendChild(rz5);
    rowZero.appendChild(rz6);
    
    tableBody.appendChild(rowZero);

    accountTable.appendChild(tableBody);

    accountDiv.appendChild(accountTable);

    //Comment
    let accountBalance = document.createElement("p");
    accountBalance.innerText = "Account is fully balanced";
    accountBalance.id = "acc-bal-"+account.id;
    accountDiv.appendChild(accountBalance);

    accountDiv.id = "acc-"+account.id;
    contentDiv.appendChild(accountDiv);

    
    var accountButton = addAccountToSidebarList(account, categoryIndex);
    addAccountToTrialBalanceDiv(account, ledgerIndex);
    if (account.type == "revenue" || account.type == "expense") {
        addAccountToIncomeStatementDiv(account, categoryIndex);
    } else {
        addAccountToBalanceSheetDiv(account, categoryIndex);
    }

    viewAccount(accountButton);
}

function addAccountToSidebarList(account, categoryIndex) {
    //Make sidebar button
    let accountButton = document.createElement("li");
    accountButton.innerText = account.name;
    accountButton.id = "sbb-"+account.id; //Sidebar Button
    accountButton.onclick = function() {viewAccount(this)};

    //Categorise account
    var accountSidebarListDiv;
    if (account.type == "fixed-asset") {
        accountSidebarListDiv = fixedAssetsListDiv;
    } else if (account.type == "current-asset") {
        accountSidebarListDiv = currentAssetsListDiv;
    } else if (account.type == "long-term-liability") {
        accountSidebarListDiv = longTermLiabilitiesListDiv;
    } else if (account.type == "current-liability") {
        accountSidebarListDiv = currentLiabilitiesListDiv;
    } else if (account.type == "equity") {
        accountSidebarListDiv = equityListDiv;
    } else if (account.type == "revenue") {
        accountSidebarListDiv = revenuesListDiv;
    } else if (account.type == "expense") {
        accountSidebarListDiv = expensesListDiv;
    }
    insertChildAtIndex(accountSidebarListDiv, accountButton, categoryIndex);
    return accountButton;
}

function addAccountToTrialBalanceDiv(account, ledgerIndex) {
    var accountRow = document.createElement("tr");
    accountRow.id = "tb-acc-"+account.id;
    accountRow.style.display = "none";
    var marginDiv = document.createElement("td");
    accountRow.appendChild(marginDiv);
    var nameDiv = document.createElement("td");
    nameDiv.innerText = account.name;
    accountRow.appendChild(nameDiv);
    var debitDiv = document.createElement("td");
    accountRow.appendChild(debitDiv);
    var creditDiv = document.createElement("td");
    accountRow.appendChild(creditDiv);
    insertChildAtIndex(trialBalanceTableDiv, accountRow, ledgerIndex+1);
}

function addAccountToIncomeStatementDiv(account, categoryIndex) {
    var tableSection;
    if (account.type == "revenue") {
        tableSection = incomeStatementRevenueTableDiv;
    } else if (account.type == "expense") {
        tableSection = incomeStatementExpenseTableDiv;
    } else {
        //Account is neither revenue nor expense!
        console.log("ERROR: Attempted to add account"+account.name+" ("+account.type+") to income statement");
        return;
    }
    var tableRow = document.createElement("tr");
    tableRow.style.display = "none";
    tableRow.id = "is-acc-"+account.id;
    var marginCol = document.createElement("td");
    tableRow.appendChild(marginCol);
    var accountNameCol = document.createElement("td");
    accountNameCol.className = "account-name";
    accountNameCol.innerText = account.name;
    tableRow.appendChild(accountNameCol);
    var totalCol1 = document.createElement("td");
    tableRow.appendChild(totalCol1);
    var totalCol2 = document.createElement("td");
    tableRow.appendChild(totalCol2);

    insertChildAtIndex(tableSection, tableRow, categoryIndex+2);
}

function addAccountToBalanceSheetDiv(account, categoryIndex) {
    var tableSection;
    if (account.type == "fixed-asset") {
        tableSection = balanceSheetFixedAssetsTableDiv;
    } else if (account.type == "current-asset") {
        tableSection = balanceSheetCurrentAssetsTableDiv;
    } else if (account.type == "long-term-liability") {
        tableSection = balanceSheetLongTermLiabilitiesTableDiv;
    } else if (account.type == "current-liability") {
        tableSection = balanceSheetCurrentLiabilitiesTableDiv;
    } else if (account.type == "equity") {
        tableSection = balanceSheetEquityTableDiv;
    }
    var tableRow = document.createElement("tr");
    tableRow.style.display = "none";
    tableRow.id = "bs-acc-"+account.id;
    var marginCol = document.createElement("td");
    tableRow.appendChild(marginCol);
    var accountNameCol = document.createElement("td");
    accountNameCol.className = "account-name";
    accountNameCol.innerText = account.name;
    tableRow.appendChild(accountNameCol);
    var totalCol1 = document.createElement("td");
    tableRow.appendChild(totalCol1);
    var totalCol2 = document.createElement("td");
    tableRow.appendChild(totalCol2);

    insertChildAtIndex(tableSection, tableRow, categoryIndex+2);
}

function addRowToAccountDiv(account) {
    var accountTableDiv = document.getElementById("acc-tb-"+account.id);
    var newRow = document.createElement("tr");
    let nr1 = document.createElement("td");
    let nr2 = document.createElement("td");
    let nr3 = document.createElement("td");
    nr3.className = "t";
    let nr4 = document.createElement("td");
    let nr5 = document.createElement("td");
    let nr6 = document.createElement("td");
    newRow.appendChild(nr1);
    newRow.appendChild(nr2);
    newRow.appendChild(nr3);
    newRow.appendChild(nr4);
    newRow.appendChild(nr5);
    newRow.appendChild(nr6);
    accountTableDiv.appendChild(newRow);
}

//Sets the last row in an account div to a total row
function setLastAccountRowDivToTotal(account, total) {
    var accountTableDiv = document.getElementById("acc-tb-"+account.id);
    var lastRow = accountTableDiv.lastElementChild;
    lastRow.className = "total";
    lastRow.children[2].innerText = total;
    lastRow.children[5].innerText = total;
}

function updateAccountDivEntry(account, row, column, date, details, amount) {
    var accountTableDiv = document.getElementById("acc-tb-"+account.id);
    var rowDivs = accountTableDiv.children;
    var rowDiv = rowDivs[row];
    var rowChildren = rowDiv.children;
    rowChildren[column*3 + 0].innerText = date;
    rowChildren[column*3 + 1].innerText = details;
    rowChildren[column*3 + 2].innerText = amount;
}

function updateAccountBalanceDiv(account) {
    var accountBalanceDiv = document.getElementById("acc-bal-"+account.id);
    var balance = account.balance;
    var accountBalanceText;
    if (balance == 0) {
        accountBalanceText = "Account is fully balanced";
    } else if (balance > 0) {
        accountBalanceText = "Account is £"+balance+" in debit";
    } else {
        accountBalanceText = "Account is £"+(-balance)+" in credit";
    }
    accountBalanceDiv.innerText = accountBalanceText;
}

function updateTrialBalanceDivEntry(account) {
    var trialBalanceRow = document.getElementById("tb-acc-"+account.id);
    var balance = account.balance;
    if (balance == 0) {
        trialBalanceRow.style.display = "none";
    } else {
        trialBalanceRow.style.display = "table-row";
        var debitCol = trialBalanceRow.children[2];
        var creditCol = trialBalanceRow.children[3];
        if (balance > 0) {
            debitCol.innerText = balance;
            creditCol.innerText = "";
        } else {
            debitCol.innerText = "";
            creditCol.innerText = (-balance);
        }
    }
}

function updateTrialBalanceDivTotal() {
    trialBalanceTotalDebitDiv.innerText = trialBalance.debits;
    trialBalanceTotalCreditDiv.innerText = trialBalance.credits;
}

function updateIncomeStatementDivEntry(account) {
    var isRevenue;
    if (account.type == "revenue") {
        isRevenue = true;
    } else if (account.type == "expense") {
        isRevenue = false;
    } else {
        //Account is neither revenue nor expense!
        console.log("ERROR: Attempted to update Income Statement for unrelated account"+account.name+" ("+account.type+")");
        return;
    }
    var tableRow = document.getElementById("is-acc-"+account.id);
    var totalDiv = tableRow.children[2];
    var total = isRevenue ? -account.balance : account.balance;
    tableRow.style.display = (total == 0) ? "none" : "table-row";
    totalDiv.innerText = (total >= 0) ? total : "("+(-total)+")";
}

//Update Revenue, Expenditure, and Profit totals on Income Statement
function updateIncomeStatementDivTotals() {
    //Revenue
    updateStatementTotalRow(incomeStatementRevenueTableDiv, incomeStatementTotalRevenueDiv, revenueAccounts, incomeStatement.revenue);
    //Expenditure
    updateStatementTotalRow(incomeStatementExpenseTableDiv, incomeStatementTotalExpenditureDiv, expenseAccounts, -incomeStatement.expenditure);
    //Profit
    var profit = incomeStatement.profit;
    incomeStatementNetProfitDiv.innerText = (profit >= 0) ? profit : "("+(-profit)+")";
    incomeStatementNetProfitLabelDiv.innerText = (profit >= 0) ? "Net Profit" : "Net Loss";
}


function updateBalanceSheetDivEntry(account) {
    var isAsset;
    if (account.type == "fixed-asset" || account.type == "current-asset") {
        isAsset = true;
    } else if (account.type == "long-term-liability" || account.type == "current-liability" || account.type == "equity") {
        isAsset = false;
    } else {
        //Account does not belong on balance sheet
        console.log("ERROR: Attempted to update Balance Sheet for unrelated account"+account.name+" ("+account.type+")");
        return;
    }
    var tableRow = document.getElementById("bs-acc-"+account.id);
    var totalDiv = tableRow.children[2];
    var total = isAsset ? account.balance : -account.balance;
    tableRow.style.display = (total == 0) ? "none" : "table-row";
    totalDiv.innerText = (total >= 0) ? total : "("+(-total)+")";
}

function updateBalanceSheetDivTotals() {
    //Fixed Assets
    updateStatementTotalRow(balanceSheetFixedAssetsTableDiv, balanceSheetFixedAssetsTotalDiv, fixedAssetAccounts, balanceSheet.fixedAssets);
    //Current Assets
    updateStatementTotalRow(balanceSheetCurrentAssetsTableDiv, balanceSheetCurrentAssetsTotalDiv, currentAssetAccounts, balanceSheet.currentAssets);
    //Long-Term Liabilities
    updateStatementTotalRow(balanceSheetLongTermLiabilitiesTableDiv, balanceSheetLongTermLiabilitiesTotalDiv, longTermLiabilityAccounts, balanceSheet.longTermLiabilities);
    //Current Liabilities
    updateStatementTotalRow(balanceSheetCurrentLiabilitiesTableDiv, balanceSheetCurrentLiabilitiesTotalDiv, currentLiabilityAccounts, balanceSheet.currentLiabilities);
    //Equity
    updateStatementTotalRow(balanceSheetEquityTableDiv, balanceSheetEquityTotalDiv, equityAccounts, balanceSheet.closingEquity);
    
    //Profit or Loss
    var profit = incomeStatement.profit;
    balanceSheetProfitDiv.innerText = (profit >= 0) ? profit : "("+(-profit)+")";
    balanceSheetProfitLabelDiv.innerText = (profit >= 0) ? "Net Profit" : "Net Loss";

    //Total Assets
    var assets = balanceSheet.totalAssets;
    balanceSheetAssetsTotalDiv.innerText = (assets >= 0) ? assets : "("+(-assets)+")";
    
    //Total Liabilities and Equity
    var lae = balanceSheet.totalLiabilitiesAndEquity;
    balanceSheetLiabilitiesAndEquityTotalDiv.innerText = (lae >= 0) ? lae : "("+(-lae)+")";
}

//Updates a subsection of the Income Statement or Balance Sheet
function updateStatementTotalRow(tableDiv, totalDiv, accountList, total) {
    var totalText = (total >= 0) ? total : "("+(-total)+")";
    totalDiv.innerText = totalText;
    var showTable = false;
    for (var account of accountList) {
        if (account.balance != 0) {
            showTable = true;
        }
    }
    if (total != 0) {
        //Equity influenced by more than just accounts
        showTable = true;
    }
    tableDiv.style.display = showTable ? "table-row-group" : "none";
}



function addRowToGeneralJournalDiv(transaction, isNewDate, isDebitEntry, hasNote, hasRepeatedNote, focusNextRow) {
    var date = transaction.date;
    var accountName = isDebitEntry ? transaction.debitAccountName : transaction.creditAccountName;
    var note = transaction.note;
    var debits = transaction.debits;

    //Add Row to General Journal Div
    let addedRow = document.createElement("tr");
    //ID
    let addedRowID = document.createElement("td");
    addedRow.appendChild(addedRowID);
    //Date
    let addedRowDate = document.createElement("td");
    if (isNewDate) {
        addedRowDate.innerText = date;
    } else {
        addedRowDate.innerText = "\"";
    }
    addedRow.appendChild(addedRowDate);
    //Account Name
    let addedRowAccount = document.createElement("td");
    addedRowAccount.innerText = accountName;
    addedRow.appendChild(addedRowAccount);
    //Note
    let addedRowNote = document.createElement("td");
    if (hasRepeatedNote) {
        addedRowNote.innerText = "\"";
    } else {
        addedRowNote.innerText = note;
    }
    addedRow.appendChild(addedRowNote);
    //Debit and Credit
    let addedRowDebit = document.createElement("td");
    let addedRowCredit = document.createElement("td");
    if (isDebitEntry) {
        addedRowDebit.innerText = debits;
    } else {
        addedRowCredit.innerText = debits;
        addedRowAccount.className = "account-credit";
    }
    addedRow.appendChild(addedRowDebit);
    addedRow.appendChild(addedRowCredit);
    newRowDiv.insertAdjacentElement('beforebegin', addedRow);

    //Setup for next New Row
    var isNextEntryDebit = !isDebitEntry;
    var outstandingDebits = isNextEntryDebit ? 0 : transaction.debits;
    resetGeneralJournalNewRowDiv(isNextEntryDebit, outstandingDebits, hasNote, focusNextRow);
    contentWrapperDiv.scrollTop = contentDiv.scrollHeight;
}

function addTotalRowToGeneralJournalDiv(date, details, focusNextRow) {
    //Add Row to General Journal Div
    let addedRow = document.createElement("tr");
    addedRow.className = "total";
    let addedRowMargin = document.createElement("td");
    addedRow.appendChild(addedRowMargin);
    let addedRowDate = document.createElement("td");
    addedRowDate.innerText = date;
    addedRow.appendChild(addedRowDate);
    let addedRowAccount = document.createElement("td");
    addedRowAccount.innerText = details;
    addedRow.appendChild(addedRowAccount);
    let addedRowNote = document.createElement("td");
    addedRow.appendChild(addedRowNote);
    let addedRowDebit = document.createElement("td");
    addedRow.appendChild(addedRowDebit);
    let addedRowCredit = document.createElement("td");
    addedRow.appendChild(addedRowCredit);
    newRowDiv.insertAdjacentElement('beforebegin', addedRow);
    //Setup for next New Row
    resetGeneralJournalNewRowDiv(true, 0, false, focusNextRow);
    contentWrapperDiv.scrollTop = contentDiv.scrollHeight;
}

function resetGeneralJournalNewRowDiv(isNextEntryDebit, outstandingDebits, lastEntryHadNote, focusNextRow) {
    //Reset Entry Row
    newRowDateDiv.innerText = "";
    newRowAccountDiv.innerText = "";
    newRowNoteDiv.innerText = "";
    newRowDebitDiv.innerText = "";
    newRowCreditDiv.innerText = "";
    generalJournalCommentDiv.innerText = "";

    addingDebitRow = isNextEntryDebit;

    if (addingDebitRow) {
        //Next row is debit
        newRowDateDiv.contentEditable = true;
        newRowNoteDiv.contentEditable = true;
        newRowDebitDiv.contentEditable = true;
        newRowAccountDiv.className = "";
        if (focusNextRow) {
            newRowDateDiv.focus();
        }
    } else {
        //Next row is same date with matching credit
        newRowDateDiv.contentEditable = false;
        newRowDateDiv.innerText = "\"";
        newRowNoteDiv.contentEditable = false;
        newRowDebitDiv.contentEditable = false;
        newRowCreditDiv.innerText = outstandingDebits;
        newRowAccountDiv.className = "account-credit";
        if (focusNextRow) {
            newRowAccountDiv.focus();
        }
        if (lastEntryHadNote) {
            newRowNoteDiv.innerText = "\"";
        }
    }
}





















//File Processing

//Parse CSV file and add its contents to Journal and Ledger
function parseCSV(csv) {
    //Reset existing accounts
    resetLedger();

    //Split by line
    var lines = csv.split(/\r\n|\n/);
    var i = 0;

    //Read accounts
    while (lines[i] != "TRANSACTIONS") {
        switch (lines[i]) {
            case "TITLE":
                setTitle(lines[i+1]);
                break;
            case "FIXED ASSETS":
                parseAccountList(lines[i+1], "fixed-asset");
                break;
            case "CURRENT ASSETS":
                parseAccountList(lines[i+1], "current-asset");
                break;
            case "LONG-TERM LIABILITIES":
                parseAccountList(lines[i+1], "long-term-liability");
                break;
            case "CURRENT LIABILITIES":
                parseAccountList(lines[i+1], "current-liability");
                break;
            case "EQUITY":
                parseAccountList(lines[i+1], "equity");
                break;
            case "REVENUES":
                parseAccountList(lines[i+1], "revenue");
                break;
            case "EXPENSES":
                parseAccountList(lines[i+1], "expense");
                break;
        }
        i += 2;
    }
    i += 1;

    //Add transactions
    while (i<lines.length) {
        console.log("Reading entry "+lines[i]+" (Row "+i+")");
        if (lines[i] != "") {
            let rowString = lines[i].split(",");
            let transaction = {};
            transaction.date = parseInt(rowString[0]);
            if (rowString.length == 2) {
                if (rowString[1] == "Accounts Balanced") {
                    transaction.type = 1;
                    balanceAccounts(transaction, false);
                } else {
                    console.log("ERROR: Unexpected line format!");
                }
            } else {
                transaction.type = 0;
                transaction.debitAccountName = rowString[1];
                transaction.creditAccountName = rowString[2];
                transaction.note = rowString[3];
                transaction.debits = parseInt(rowString[4]);
                addDebitRow(transaction, false);
                addCreditRow(transaction, false);
            }
        }
        i += 1;
    }
}

function parseAccountList(accountNameList, accountType) {
    var accountNames = accountNameList.split(",");
    for (accountName of accountNames) {
        if (accountName != "") {
            addAccount(accountName, toID(accountName), accountType);
        }
    }
}

function writeCSV() {
    var text = "";

    text += "TITLE\r\n";
    text += title + "\r\n";
    text += "FIXED ASSETS\r\n";
    text += writeCommaSeparatedAccountList(fixedAssetAccounts) + "\r\n";
    text += "CURRENT ASSETS\r\n";
    text += writeCommaSeparatedAccountList(currentAssetAccounts) + "\r\n";
    text += "LONG-TERM LIABILITIES\r\n";
    text += writeCommaSeparatedAccountList(longTermLiabilityAccounts) + "\r\n";
    text += "CURRENT LIABILITIES\r\n";
    text += writeCommaSeparatedAccountList(currentLiabilityAccounts) + "\r\n";
    text += "EQUITY\r\n";
    text += writeCommaSeparatedAccountList(equityAccounts) + "\r\n";
    text += "REVENUES\r\n";
    text += writeCommaSeparatedAccountList(revenueAccounts) + "\r\n";
    text += "EXPENSES\r\n";
    text += writeCommaSeparatedAccountList(expenseAccounts) + "\r\n";
    text += "TRANSACTIONS\r\n";
    for (var i=0; i<generalJournal.length; i++) {
        text += writeCommaSeparatedTransaction(generalJournal[i]) + "\r\n";
    }
    return text;
}

function writeNextPeriodCSV() {
    var text = "";

    text += "TITLE\r\n";
    text += title + " (Continued)" + "\r\n";
    text += "FIXED ASSETS\r\n";
    text += writeCommaSeparatedAccountList(fixedAssetAccounts) + "\r\n";
    text += "CURRENT ASSETS\r\n";
    text += writeCommaSeparatedAccountList(currentAssetAccounts) + "\r\n";
    text += "LONG-TERM LIABILITIES\r\n";
    text += writeCommaSeparatedAccountList(longTermLiabilityAccounts) + "\r\n";
    text += "CURRENT LIABILITIES\r\n";
    text += writeCommaSeparatedAccountList(currentLiabilityAccounts) + "\r\n";
    text += "EQUITY\r\n";
    text += "Balance b/f,Profit and Loss"
    if (equityAccounts.length > 0) {
        text += ","+writeCommaSeparatedAccountList(equityAccounts) + "\r\n";
    } else {
        text += "\r\n";
    }
    text += "REVENUES\r\n";
    text += writeCommaSeparatedAccountList(revenueAccounts) + "\r\n";
    text += "EXPENSES\r\n";
    text += writeCommaSeparatedAccountList(expenseAccounts) + "\r\n";
    text += "TRANSACTIONS\r\n";
    for (var account of generalLedger) {
        if (account.balance != 0 && account.type != "revenue" && account.type != "expense") {
            var transaction = {};
            transaction.date = 0;
            transaction.debitAccountName = (account.balance >= 0) ? account.name : "Balance b/f";
            transaction.creditAccountName = (account.balance >= 0) ? "Balance b/f" : account.name;
            transaction.note = "";
            transaction.debits = (account.balance >= 0) ? account.balance : -account.balance;
            text += writeCommaSeparatedTransaction(transaction) + "\r\n";
        }
    }
    if (incomeStatement.profit != 0) {
        var profit = incomeStatement.profit;
        var transaction = {};
        transaction.date = 0;
        transaction.debitAccountName = (profit >= 0) ? "Balance b/f" : "Profit and Loss";
        transaction.creditAccountName = (profit >= 0) ? "Profit and Loss" : "Balance b/f";
        transaction.note = "";
        transaction.debits = (profit >= 0) ? profit : -profit;
        text += writeCommaSeparatedTransaction(transaction) + "\r\n";
    }
    return text;
}

function writeCommaSeparatedAccountList(accounts) {
    var list = "";
    for (var i=0; i<accounts.length; i++) {
        list += accounts[i].name;
        if (i < accounts.length - 1) {
            list += ",";
        }
    }
    return list;
}

function writeCommaSeparatedTransaction(transaction) {
    var text = "";
    if (transaction.type == 0) {
        text += transaction.date + ",";
        text += transaction.debitAccountName + ",";
        text += transaction.creditAccountName + ",";
        text += transaction.note + ",";
        text += transaction.debits;
    } else {
        text += transaction.date + ",";
        text += "Accounts Balanced";
    }
    return text;
}


















//Utility Functions

function removeChildrenWithIDPrefix(parent, prefix) {
    var length = prefix.length;
    childrenToRemove = [];
    var child;
    for (child of parent.children) {
        if (child.id.substring(0,length) == prefix) {
            childrenToRemove.push(child);
        }
    }
    for (child of childrenToRemove) {
        child.remove();
    }
}

function insertChildAtIndex(parent, child, index) {
    var children = parent.children;
    if (index < children.length) {
        var childToDisplace = children[index];
        childToDisplace.insertAdjacentElement('beforebegin', child);
    } else {
        parent.appendChild(child);
    }
}

function findAccountIndex(account, accountList) {
    var index = 0;
    var atIndex = false;
    while (!atIndexYet(account, accountList, index)) {
        index += 1;
    }
    return index;
}

function atIndexYet(account, accountList, index) {
    if (index >= accountList.length) {
        return true;
    }
    return accountsInOrder(account, accountList[index]);
}

function accountsInOrder(account1, account2) {
    var account1Type = accountTypeToInt(account1.type);
    var account2Type = accountTypeToInt(account2.type);
    if (account2Type > account1Type) {
        return true;
    }
    if (account1Type > account2Type) {
        return false;
    }
    return(account2.name > account1.name);
}

function accountTypeToInt(accountType) {
    if (accountType == "fixed-asset") {
        return 0;
    } else if (accountType == "current-asset") {
        return 1;
    } else if (accountType == "long-term-liability") {
        return 2;
    } else if (accountType == "current-liability") {
        return 3;
    } else if (accountType == "equity") {
        return 4;
    } else if (accountType == "revenue") {
        return 5;
    } else if (accountType == "expense") {
        return 6;
    } else {
        return 7;
    }
}

function isAccountNameValid(name) {
    if (!isStringSanitised(name)) {
        console.log("Account name \""+name+"\" is unsanitised");
        return false; //String not sanitised
    }
    id = toID(name);
    if (id == "") {
        console.log("Account name \""+name+"\" has no letters or numbers");
        return false; //Account name has no letters or numbers
    }
    for (var account of generalLedger) {
        if (account.id == id) {
            console.log("Account name \""+name+"\" is ambiguous with existing account \""+account.name+"\"");
            return false; //Name is taken / ambiguous
        }
    }
    for (var reservedID of reservedAccountIDs) {
        if (id == reservedID) {
            console.log("Account name \""+name+"\" conflicts with reserved id \""+reservedID+"\"");
            return false; //Can't have that
        }
    }
    return true;
}

function toPositiveInteger(string) {
    var int = parseInt(string);
    if (int != int) { //Test for NaN
        return -1;
    }
    if (int < 1) {
        return -1;
    }
    return int;
}

function findAccountByName(accountName) {
    for (var account of generalLedger) {
        if (account.name == accountName) {
            return account;
        }
    }
    return null;
}

function findAccountByID(accountID) {
    for (var account of generalLedger) {
        if (account.id == accountID) {
            return account;
        }
    }
    return null;
}

function isStringSanitised(string) {
    var char, i;
    for (i=0; i<string.length; i++) {
        char = string.charAt(i);
        if (!isSafeChar(char)) {
            return false;
        }
    }
    return true;
}

//Condenses a string into suitable characters for CSV files
function sanitise(string) {
    var safeString = "";
    var char, i;
    for (i=0; i<string.length; i++) {
        char = string.charAt(i);
        if (isSafeChar(char)) {
            safeString += char;
        }
    }
    return safeString;
}

//Condenses a string into characters suitable for an HTML id
function toID(string) {
    var id = "";
    var char, i;
    for (i=0; i<string.length; i++) {
        char = string.charAt(i);
        if (isAlphanumericChar(char)) {
            id += char;
        }
    }
    return id;
}

//Returns true if character is considered 'safe' for entry into CSV files (notes, account names)
function isSafeChar(char) {
    return ((char >= '0' && char <= '9') //Numbers
            || (char >= 'a' && char <= 'z') //Lowercase letters
            || (char >= 'A' && char <= 'Z') //Uppercase letters
            || (char == ' ') //Space
            || (char == '-') //Hyphen
            || (char == '_') //Underscore
            || (char == '/') //Slash
            || (char == '.') //Full stop
            // || (char == ',') //Comma - not permitted until I can parse CSV files properly
            || (char == '\'') //Apostrophe
        );
}

//Returns true if character is a letter or number
function isAlphanumericChar(char) {
    return ((char >= '0' && char <= '9') ||
            (char >= 'a' && char <= 'z') ||
            (char >= 'A' && char <= 'Z'));
}
















resetLedger();
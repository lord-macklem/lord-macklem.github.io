//Cache DOM
const noblesList = document.getElementById("nobles-list");
const noblesChecklist = document.getElementById("nobles-checklist");
const nobleSelection = document.getElementById("noble-select");
const cardStacks = document.getElementById("card-stacks");

const totalStrengthDiv = document.getElementById("total-strength");
const bonusStrengthDiv = document.getElementById("bonus-strength");
const bonusStrengthWrapperDiv = document.getElementById("bonus-wrapper");
const lordsDiv = document.getElementById("lords");
const commonsDiv = document.getElementById("commons");

//Interface Manager
class InterfaceManager {

    constructor() {
        //Pre-built noble selector actually selects nobles
        nobleSelection.addEventListener("change", (event) => {
            const nobleIndex = nobleSelection.selectedIndex - 1;
            const noble = nobles[nobleIndex];
            addNoble(noble);
            nobleSelection.selectedIndex = 0;
        });
        //Build hidden noble elements
        for (let i=0; i<nobles.length; i++) {
            this.addNobleSelectOption(nobles[i]);
            this.addNobleDiv(nobles[i]);
            this.addNobleCardStackDiv(nobles[i]);
        }
        //Build hidden crown card selection options
        this.addCrownCardSelectOptions();
        this.showOrHideCrownCardOptions();
    }

    //Initialisation Functions

    addNobleSelectOption(noble) {
        let nobleDiv = document.createElement("option");
        nobleDiv.id = "nobleoption-"+noble.id;
        let nobleImg = document.createElement("img");
        nobleImg.src = noble.imgurl;
        nobleDiv.appendChild(nobleImg);
        let nobleName = document.createTextNode(noble.selectionName);
        nobleDiv.appendChild(nobleName);
        nobleSelection.appendChild(nobleDiv);
    }

    addNobleDiv(noble) {
        var nobleDiv = document.createElement("div");
        nobleDiv.style.display = "none";
        nobleDiv.className = "noble";
        nobleDiv.id = noble.id;
        var nobleImage = document.createElement("img");
        nobleImage.src = noble.imgurl;
        nobleDiv.appendChild(nobleImage);
        var nobleName = document.createElement("h1");
        nobleName.innerText = noble.name;
        nobleDiv.appendChild(nobleName);
        var nobleTotal = document.createElement("p");
        nobleTotal.className = "total"
        nobleTotal.innerText = "0";
        nobleDiv.appendChild(nobleTotal);
        var nobleBonusList = document.createElement("div");
        nobleBonusList.className = "bonus-list";
        nobleBonusList.id = noble.id+"-bonuslist";
        nobleDiv.appendChild(nobleBonusList);
        noblesList.appendChild(nobleDiv);
    }

    addNobleCardStackDiv(noble) {
        //Stack Div
        let stackDiv = document.createElement("div");
        stackDiv.id = noble.id+"-cardstack";
        stackDiv.style.display = "none";
        stackDiv.className = "card-stack";
        
        //Wrapper for Noble & built-in Title Card
        let nobleCardWrapper = document.createElement("div");
        
        //Noble Card
        let nobleCardDiv = document.createElement("div");
        nobleCardDiv.className = "card noble-card";
        nobleCardDiv.innerText = noble.name+" "+noble.strength;
        
        //X Button for Noble Card
        let nobleCardX = document.createElement("span");
        nobleCardX.className = "card-x";
        nobleCardX.innerText = "X";
        nobleCardX.addEventListener("click", () => {
            removeNoble(noble);
        });
        nobleCardDiv.appendChild(nobleCardX);
        nobleCardWrapper.appendChild(nobleCardDiv);
        
        //Built-in Title Card
        if (noble.title != null) {
            let titleDiv = document.createElement("div");
            titleDiv.className = "card title-card";
            titleDiv.innerText = noble.title;
            nobleCardWrapper.appendChild(titleDiv);
        }
        stackDiv.appendChild(nobleCardWrapper);
        
        //Container for awarded Crown Cards
        let crownCardContainer = document.createElement("div");
        crownCardContainer.id = noble.id+"-crowncardcontainer";
        stackDiv.appendChild(crownCardContainer);

        //Drop-down selector for new Crown Cards
        let crownCardSelector = document.createElement("select");
        crownCardSelector.id = noble.id+"-crowncardselector";
        crownCardSelector.className = "crown-card-selector";
        let defaultOption = document.createElement("option");
        defaultOption.innerText = "Award Crown Card";
        defaultOption.style.display = "none";
        crownCardSelector.appendChild(defaultOption);
        stackDiv.appendChild(crownCardSelector);

        crownCardSelector.addEventListener("change", (event) => {
            let crownCard = crownCards[event.target.selectedIndex-1];
            awardCrownCard(noble, crownCard);
            event.target.selectedIndex = 0;
        });

        cardStacks.appendChild(stackDiv);
    }

    addCrownCardSelectOptions() {
        for (let noble of nobles) {
            const crownCardSelector = document.getElementById(noble.id+"-crowncardselector");
            for (let i=0; i<crownCards.length; i++) {
                let crownCard = crownCards[i];
                let cardOption = document.createElement("option");
                cardOption.id = noble.id+"-cardoption-"+crownCard.index;
                cardOption.className = crownCard.type+"-card";
                cardOption.innerText = crownCard.name;
                crownCardSelector.appendChild(cardOption);
            }
        }
    }


    //Other Functions

    addNobleBonus(noble) {
        let bonusList = document.getElementById(noble.id+"-bonuslist");
        let bonusElem = document.createElement("p");
        bonusElem.className = "bonus";
        let bonusValue = document.createElement("span");
        bonusValue.className = "value";
        bonusElem.appendChild(bonusValue);
        let bonusLocation = document.createElement("span");
        bonusLocation.className = "location";
        bonusElem.appendChild(bonusLocation);
        bonusList.appendChild(bonusElem);
    }

    updateNobleBonuses(noble) {
        let bonusListElem = document.getElementById(noble.id+"-bonuslist");
        let bonusList = noble.bonusList;

        let diff = bonusList.length - bonusListElem.children.length;
        if (diff > 0) {
            for (let i=0; i<diff; i++) {
                this.addNobleBonus(noble);
            }
        }
        let bonusElems = bonusListElem.children;
        for (let i=0; i<bonusElems.length; i++) {
            let bonusElem = bonusElems[i];
            if (i < bonusList.length) {
                //Strength value
                bonusElem.children[0].innerText = bonusList[i][1];
                //Bonus location
                //TODO localize these!
                bonusElem.children[1].innerText = " "+bonusList[i][0];
            } else {
                //Minimise surplus elements instead of deleting them, it's not worth the hassle
                bonusElem.children[0].innerText = "";
                bonusElem.children[1].innerText = "";
            }
        }
    }

    addCardToStack(noble, crownCard, index) {
        let cardDiv = document.createElement("div");
        cardDiv.className = "card "+crownCard.type+"-card";
        cardDiv.id = noble.id+"-crowncard-"+crownCard.index;
        cardDiv.innerText = crownCard.displayString;
        let cardX = document.createElement("span");
        cardX.className = "card-x";
        cardX.innerText = "X";
        cardX.addEventListener("click", () => {
            revokeCrownCard(noble, crownCard);
        });
        cardDiv.appendChild(cardX);
        const cardContainerDiv = document.getElementById(noble.id+"-crowncardcontainer");
        let children = cardContainerDiv.children;
        if (index < children.length) {
            let childToDisplace = children[index];
            childToDisplace.insertAdjacentElement('beforebegin', cardDiv);
        } else {
            cardContainerDiv.appendChild(cardDiv);
        }
    }

    removeCardFromStack(noble, crownCard) {
        let cardElem = document.getElementById(noble.id+"-crowncard-"+crownCard.index);
        cardElem.remove();
    }

    showNobleTotal(noble) {
        const nobleDiv = document.getElementById(noble.id);
        nobleDiv.style.display = "inline-block";
    }
    showNobleCardStack(noble) {
        const nobleCardStackDiv = document.getElementById(noble.id+"-cardstack");
        nobleCardStackDiv.style.display = "inline-block";
    }
    showNobleOption(noble) {
        const nobleOptionDiv = document.getElementById("nobleoption-"+noble.id);
        nobleOptionDiv.style.display = "block";
    }
    hideNobleTotal(noble) {
        const nobleDiv = document.getElementById(noble.id);
        nobleDiv.style.display = "none";
    }
    hideNobleCardStack(noble) {
        const nobleCardStackDiv = document.getElementById(noble.id+"-cardstack");
        nobleCardStackDiv.style.display = "none";
        //Remove cards
        const nobleCardContainer = document.getElementById(noble.id+"-crowncardcontainer");
        while (nobleCardContainer.firstChild) {
            nobleCardContainer.lastChild.remove();
        }
    }
    hideNobleSelectOption(noble) {
        const nobleOptionDiv = document.getElementById("nobleoption-"+noble.id);
        nobleOptionDiv.style.display = "none";
    }
    showOrHideCrownCardOptions() {
        for (let noble of nobles) {
            for (let crownCard of crownCards) {
                let selectOptionElem = document.getElementById(noble.id+"-cardoption-"+crownCard.index);
                if (noble.canBeAwarded(crownCard)) {
                    selectOptionElem.style.display = "block";
                } else {
                    selectOptionElem.style.display = "none";
                }
            }
        }
    }

    updateStats() {
        let strength = 0;
        let bonus = 0;
        let lords = 0;
        let commons = 0;
        for (let noble of nobles) {
            if (noble.isOwned) {
                strength += noble.totalStrength;
                bonus += noble.totalBonus;
                lords += noble.lords;
                for (let crownCard of noble.crownCards) {
                    lords += crownCard.lords;
                    commons += crownCard.commons;
                }
            }
        }
        totalStrengthDiv.innerText = strength;
        if (bonus > 0) {
            bonusStrengthWrapperDiv.style.display = "inline";
        } else {
            bonusStrengthWrapperDiv.style.display = "none";
        }
        bonusStrengthDiv.innerText = bonus;
        lordsDiv.innerText = lords;
        commonsDiv.innerText = commons;
    }

    updateNoble(noble) {
        const nobleDiv = document.getElementById(noble.id);
        const strengthDiv = nobleDiv.children[2];
        strengthDiv.innerText = noble.totalStrength;
        this.updateNobleBonuses(noble);
    }
}
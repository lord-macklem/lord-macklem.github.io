class Noble {
    constructor(name, title, strength, lords, commons) {
        this.name = name;
        this.title = title;
        this.strength = strength;
        this.lords = lords;
        this.commons = commons;

        this.hasTitle = (title != null);
        this.hasOffice = false;
        this.isOwned = false;
        this.isStacked = false;
        this.crownCards = [];
    }

    //Add or remove from faction
    add() {
        this.isOwned = true;
    }
    remove() {
        this.isOwned = false;
        for (let crownCard of this.crownCards) {
            crownCard.disallocate();
        }
        this.crownCards = [];
        this.hasTitle = (this.title != null);
        this.hasOffice = false;
    }

    //Add or remove from troop stack
    stack() {
        this.isStacked = true;
    }
    unstack() {
        this.isStacked = false;
    }

    //Determine if a crown card can be awarded to this noble
    canBeAwarded(crownCard) {
        if (crownCard.allocated) {
            return false;
        }
        if (crownCard.type == "title") {
            //Titles can only be awarded if untitled
            return !this.hasTitle;
        }
        if (crownCard.type == "office") {
            //A max of one office can only be awarded if titled
            return (this.hasTitle && !this.hasOffice);
        }
        //Other crown cards can always be awarded
        return true;
    }

    //Award a crown card to this noble
    award(crownCard) {
        let index = 0;
        for (let i=0; i<this.crownCards.length; i++) {
            if (crownCard.index > this.crownCards[i].index) {
                index += 1;
            }
        }
        this.crownCards.splice(index, 0, crownCard);
        crownCard.allocate(this);
        if (crownCard.type == "title") {
            this.hasTitle = true;
        }
        if (crownCard.type == "office") {
            this.hasOffice = true;
        }
        return index;
    }

    //Revoke a crown card from this noble
    revoke(crownCard) {
        crownCard.disallocate();
        this.crownCards.splice(this.crownCards.indexOf(crownCard), 1);
        if (crownCard.type == "title") {
            this.hasTitle = false;
        }
        if (crownCard.type == "office") {
            this.hasOffice = false;
        }
    }

    //Gets the total permanent troop strength of this noble (not including bonuses)
    get totalStrength() {
        let strength = this.strength;
        for (let crownCard of this.crownCards) {
            strength += crownCard.strength;
        }
        return strength;
    }

    //Gets the total bonus troop strength of this noble
    get totalBonus() {
        let bonus = 0;
        for (let crownCard of this.crownCards) {
            bonus += crownCard.bonus;
        }
        return bonus;
    }

    //Gets the strength of this noble at a particular location
    strengthAt(location) {
        let strength = this.totalStrength;
        let locations = [location];
        if (location == "Conway") {
            locations.push("Wales");
        } else if (location == "Tees") {
            locations.push("Trent");
        }
        for (let crownCard of this.crownCards) {
            if (locations.includes(crownCard.bonusLocation)) {
                strength += crownCard.bonus;
            }
        }
        return strength;
    }

    //Gets a list of 2-element lists containing locations where bonuses apply and the total troop strengths in those locations
    get bonusList() {
        let bonusList = [];
        let bonusLocations = [];
        //Find relevant locations
        for (let crownCard of this.crownCards) {
            if (crownCard.bonusLocation != null) {
                if (!bonusLocations.includes(crownCard.bonusLocation)) {
                    bonusLocations.push(crownCard.bonusLocation);
                }
            }
        }
        //Compile list
        for (let location of bonusLocations) {
            bonusList.push([location, this.strengthAt(location)]);
        }
        return bonusList;
    }

    //Selection name is used when Plantagenets should be distinguished
    get selectionName() {
        if (this.name != "Plantagenet") {
            return this.name;
        } else if (this.title == "Duke of York") {
            return "Plantagenet (York)";
        } else {
            return "Plantagenet (Lancaster)";
        }
    }

    //Lowercase string unique for each noble (used in heraldry images and element ids)
    get id() {
        if (this.name != "Plantagenet") {
            return this.name.toLowerCase();
        }
        if (this.title == "Duke of York") {
            return "york";
        } else {
            return "lancaster";
        }
    }

    //Image url for this noble's coat of arms
    get imgurl() {
        return "heraldry/"+this.id+".png";
    }
}




class CrownCard {
    constructor(type, name, strength, bonus, bonusLocation, lords, commons) {
        this.type = type;
        this.name = name;
        this.strength = strength;
        this.bonus = bonus;
        this.bonusLocation = bonusLocation;
        this.lords = lords;
        this.commons = commons;
        this.allocated = false;
        this.noble = null;
    }
    get displayString() {
        let string = this.name;
        if (this.strength > 0) {
            string += " " + this.strength;
        }
        if (this.bonus > 0) {
            string += " (+" + this.bonus + ")";
        }
        return string;
    }
    allocate(noble) {
        this.allocated = true;
        this.noble = noble;
    }
    disallocate() {
        this.allocated = false;
        this.noble = null;
    }
}

const nobles = [
    new Noble("Audley", null, 10, 1, 0),
    new Noble("Beaufort", "Duke of Somerset", 30, 3, 2),
    new Noble("Berkeley", null, 10, 1, 0),
    new Noble("Bourchier", null, 10, 1, 0),
    new Noble("Clifford", null, 10, 1, 0),
    new Noble("Courtenay", "Earl of Devonshire", 30, 2, 1),
    new Noble("Cromwell", null, 10, 1, 0),
    new Noble("FitzAlan", "Earl of Arundel", 30, 2, 1),
    new Noble("Grey", null, 20, 1, 0),
    new Noble("Greystoke", null, 10, 1, 0),
    new Noble("Hastings", null, 10, 10, 0),
    new Noble("Herbert", null, 10, 1, 0),
    new Noble("Holland", null, 20, 1, 0),
    new Noble("Howard", null, 10, 1, 0),
    new Noble("Mowbray", "Duke of Norfolk", 50, 4, 2),
    new Noble("Neville", "Earl of Warwick", 50, 4, 3),
    new Noble("Percy", "Earl of Northumberland", 100, 3, 2),
    new Noble("Pole", "Duke of Suffolk", 30, 2, 1),
    new Noble("Roos", null, 20, 1, 0),
    new Noble("Scrope", null, 10, 1, 0),
    new Noble("Stafford", "Duke of Buckingham", 30, 2, 1),
    new Noble("Stanley", null, 50, 2, 0),
    new Noble("Talbot", "Earl of Shrewsbury", 30, 2, 1),
    new Noble("Plantagenet", "Duke of Lancaster", 30, 0, 0),
    new Noble("Plantagenet", "Duke of York", 50, 0, 0)
];

for (let i=0; i<nobles.length; i++) {
    nobles[i].index = i;
}

const crownCards = [
    //Titles
    new CrownCard("title", "Earl of Kent", 30, 0, null, 0, 1),
    new CrownCard("title", "Earl of Westmorland", 40, 0, null, 0, 1),
    new CrownCard("title", "Earl of Essex", 20, 0, null, 0, 1),
    new CrownCard("title", "Earl of Richmond", 40, 0, null, 0, 1),
    new CrownCard("title", "Earl of Worcester", 30, 0, null, 0, 1),
    new CrownCard("title", "Earl of Wiltshire", 30, 0, null, 0, 1),
    new CrownCard("title", "Duke of Exeter", 20, 0, null, 0, 1),
    new CrownCard("title", "Earl of Salisbury", 30, 0, null, 0, 1),
    //Offices
    new CrownCard("office", "Chancellor of England", 50, 0, null, 0, 20),
    new CrownCard("office", "Marshal of England", 100, 0, null, 0, 0),
    new CrownCard("office", "Treasurer of England", 50, 0, null, 0, 0),
    new CrownCard("office", "Steward of the Royal Household", 50, 0, null, 0, 0),
    new CrownCard("office", "Constable of Dover Castle", 50, 0, null, 0, 0),
    new CrownCard("office", "Constable of the Tower", 50, 200, "London", 0, 3),
    new CrownCard("office", "Chancellor of Cornwall", 50, 100, "Devon and Cornwall", 0, 2),
    new CrownCard("office", "Chamberlain of Chester", 50, 200, "Wales", 0, 0),
    new CrownCard("office", "Chancellor of Lancaster", 50, 100, "Conway", 0, 3),
    new CrownCard("office", "Warden of the Marches", 50, 100, "Tees", 0, 2),
    new CrownCard("office", "Lieutenant of Ireland", 50, 200, "Ireland", 0, 0),
    new CrownCard("office", "Captain of Calais", 50, 300, "Calais", 0, 0),
    new CrownCard("office", "Warden of the Cinque Ports", 50, 0, null, 0, 5),
    new CrownCard("office", "Admiral of England", 50, 0, null, 0, 0),
    //Mercenaries
    new CrownCard("mercenary", "Burgundian Crossbowmen", 30, 0, null, 0, 0),
    new CrownCard("mercenary", "Burgundian Crossbowmen", 30, 0, null, 0, 0),
    new CrownCard("mercenary", "Flemish Crossbowmen", 20, 0, null, 0, 0),
    new CrownCard("mercenary", "Flemish Crossbowmen", 20, 0, null, 0, 0),
    new CrownCard("mercenary", "Saxons", 10, 0, null, 0, 0),
    new CrownCard("mercenary", "Saxons", 10, 0, null, 0, 0),
    new CrownCard("mercenary", "Scots Archers", 20, 0, null, 0, 0),
    new CrownCard("mercenary", "Scots Archers", 20, 0, null, 0, 0),
    new CrownCard("mercenary", "French Foot Soldiers", 100, 0, null, 0, 0),
    new CrownCard("mercenary", "Scottish Foot Soldiers", 80, 0, null, 0, 0),
    //Bishops
    new CrownCard("bishop", "Archbishop of Canterbury", 0, 0, null, 7, 0),
    new CrownCard("bishop", "Archbishop of York", 0, 30, "Trent", 5, 0),
    new CrownCard("bishop", "Bishop of Durham", 0, 30, "Trent", 4, 0),
    new CrownCard("bishop", "Bishop of Carlisle", 0, 30, "Trent", 3, 0),
    new CrownCard("bishop", "Bishop of Lincoln", 0, 0, null, 2, 0),
    new CrownCard("bishop", "Bishop of Norwich", 0, 0, null, 2, 0),
    //Town Cards
    new CrownCard("town", "Bristol", 0, 0, null, 0, 4),
    new CrownCard("town", "Carisbrooke", 0, 0, null, 0, 0),
    new CrownCard("town", "Coventry", 0, 0, null, 0, 3),
    new CrownCard("town", "Ipswich", 0, 0, null, 0, 3),
    new CrownCard("town", "Lancaster", 0, 0, null, 0, 3),
    new CrownCard("town", "Leicester", 0, 0, null, 0, 3),
    new CrownCard("town", "Newcastle", 0, 0, null, 0, 3),
    new CrownCard("town", "Northampton", 0, 0, null, 0, 3),
    new CrownCard("town", "Nottingham", 0, 0, null, 0, 3),
    new CrownCard("town", "Shrewsbury", 0, 0, null, 0, 3),
    new CrownCard("town", "Swansea", 0, 0, null, 0, 0),
];

for (let i=0; i<crownCards.length; i++) {
    crownCards[i].index = i;
}
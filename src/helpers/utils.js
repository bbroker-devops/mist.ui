function numeral(num){
    function solveRight(rightPart){
        let res = `${rightPart.slice(0,2)}.${rightPart.slice(2)}`;
        res = parseFloat(res);
        res = Math.round(res);
        return res;
    }
    const suffixes = {"3": "k", "6": "m", "9": "b", "12": "t", "15": "q"};
    let toFormat = Number(num);
    const prefix = toFormat < 0 ? "-" : "";
    toFormat = Math.abs(toFormat);
    if(toFormat < 1000){
        return `${prefix}${String(toFormat.toFixed(2))}`;
    }
    toFormat = String(toFormat);
    [toFormat] = toFormat.split(".");
    let res = "";
    const order = parseInt((toFormat.length-1)/3, 10) * 3;
    const comma = toFormat.length - order
    res = `${toFormat.slice(0, comma)}.`;
    const rightP = solveRight(toFormat.slice(comma));
    res += String(rightP);
    res += suffixes[order];
    return `${prefix}${res}`;
}

function ratedCost(cost, rate) {
    const c = parseFloat(cost || 0);
    const rc = c * rate;
    return c && rc ? numeral(rc) : numeral(cost);
}

function formatMoney(value, decs_, dot_, comma_){
    const decs = Number.isNaN(Math.abs(decs_)) ? 2 : decs_;
    const val = Math.abs(Number(value) || 0).toFixed(decs);
    const dot = dot_ === undefined ? "." : dot_;
    const comma = comma_ === undefined ? "," : comma_;
    const prefix = value < 0 ? "-" : "";
    const number = String(parseInt(val, 10));
    let commaIndex = number.length;
    commaIndex = commaIndex > 3 ? commaIndex % 3: 0;
    return prefix + (commaIndex ? number.substr(0, commaIndex) + 
        comma: "") + number.substr( commaIndex).replace(/(\d{3})(?=\d)/g, `$1${ comma }`) + (decs ? dot + 
            Math.abs(val - number).toFixed(decs).slice(2): "");
}

function itemUid(item, section) {
    // Returns a universal resource id of the form
    //      resourceType:[cloudId]:itemId
    // e.g. machine:3tm7aaHHZcMxpZ:bf04f27e924fa67023582,
    //      key::MnhLdx9u22YjVJ
    //
    // TODO replace with mist uuids

    // if item type is not defined derive it fro the current section id
    const itemType = item && item.type ? item.type : (section && section.id.slice(0, -1));
    const cloudId = item && section && section.id !== 'machines' && item.cloud && item.cloud.id ? item.cloud.id :
        '';
    let itemId = item && item.id ? item.id : '';
    if (itemType === 'incident')
        itemId = item.incident_id
    return `${ itemType  }:${  cloudId  }:${  itemId }`;
}

function mapToArray(obj) {
    const arr = [];
    if (obj) {
        Object.keys(obj).forEach((id) => {
            arr.push(obj[id]);
        });
    }
    return arr;
}

function _generateMap(list, field) {
    const out = {};
    let _field = field;
    if (field === undefined) {
        _field = 'id';
    }
    for (let i = 0; i < list.length; i++) {
        out[list[i][_field]] = list[i];
    }
    // console.log('generate map', list, field, JSON.stringify(out));
    return out;
}

function intersection(a, b){
    const _a = a instanceof Set ? a : new Set(a);
    const _b = b instanceof Set ? b : new Set(b);
    return new Set( [ ..._a ].filter(v => _b.has(v)) );
}

const CSRFToken = { value: "" };
const stripePublicAPIKey = { value: ""};
export { ratedCost, formatMoney, itemUid, mapToArray, _generateMap, intersection, CSRFToken, stripePublicAPIKey };

function jsonDiff(actualValue, expectedValue) {
   internalJsonDiff(actualValue, expectedValue, "");
}

function internalJsonDiff(actualValue, expectedValue, key) {
    if (actualValue === undefined) {
        console.log("key '" + key + "' missing in actual json");
    } else if (typeof expectedValue !== typeof actualValue){
        console.log("key '" + key + "' has type mismatch: expected = " + typeof expectedValue + " actual = " + typeof actualValue);
    } else if(Array.isArray(expectedValue) && !Array.isArray(actualValue)) {
        console.log("key '" + key + "' has type mismatch: expected = array actual = object");
    }  else if(!Array.isArray(expectedValue) && Array.isArray(actualValue)) {
        console.log("key '" + key + "' has type mismatch: expected = object actual = array");
    }  else {
        if (!(typeof expectedValue === 'object')) {
            if (expectedValue != actualValue) {
                console.log("key '" + key + "' has value mismatch: expected = " + expectedValue + " actual = " + actualValue);
            }
        } else if (typeof expectedValue === 'object' && !(Array.isArray(expectedValue))) {
            for (var innerKey of Object.keys(expectedValue)) {
                internalJsonDiff(actualValue[innerKey], expectedValue[innerKey], key === "" ? innerKey : key + "." + innerKey);
            }
        } else if (Array.isArray(expectedValue)) {
            if (expectedValue.length !== actualValue.length) {
                console.log("key '" + key + "' has array length mismatch: expected size = " + expectedValue.length + " actual size = " + actualValue.length);
            } else {
                for (var i = 0; i < expectedValue.length; i++) {
                    internalJsonDiff(actualValue[i], expectedValue[i], key + "[" + i + "]");
                }
            }
        }
    }
}

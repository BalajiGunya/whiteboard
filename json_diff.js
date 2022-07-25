function jsonDiff(actualValue, expectedValue) {
    var output = internalJsonDiff(actualValue, expectedValue, "");
    return {
        equals : output.equals,
        differences: output.differences.trim()
    };
}

function internalJsonDiff(actualValue, expectedValue, key) {
    var differences = "";
    if (actualValue === undefined) {
        differences += "key '" + key + "' missing in actual json\n";
    } else if (expectedValue instanceof RegExp) {
        if (!actualValue.match(expectedValue)) {
            differences += "key '" + key + "' has regex mismatch: expected to match the regex = " + expectedValue + " actual value = " + actualValue + "\n";
        }
    } else if (typeof expectedValue !== typeof actualValue){
        differences += "key '" + key + "' has type mismatch: expected = " + typeof expectedValue + " actual = " + typeof actualValue + "\n";
    } else if(Array.isArray(expectedValue) && !Array.isArray(actualValue)) {
        differences += "key '" + key + "' has type mismatch: expected = array actual = object\n";
    }  else if(!Array.isArray(expectedValue) && Array.isArray(actualValue)) {
        differences += "key '" + key + "' has type mismatch: expected = object actual = array\n";
    }  else {
        if (!(typeof expectedValue === 'object')) {
            if (expectedValue != actualValue) {
                differences += "key '" + key + "' has value mismatch: expected = " + expectedValue + " actual = " + actualValue + "\n";
            }
        } else if (typeof expectedValue === 'object' && !(Array.isArray(expectedValue))) {
            for (var innerKey of Object.keys(expectedValue)) {
                var internalOutput = internalJsonDiff(actualValue[innerKey], expectedValue[innerKey], key === "" ? innerKey : key + "." + innerKey);
                differences += internalOutput.differences;
            }
        } else if (Array.isArray(expectedValue)) {
            if (expectedValue.length !== actualValue.length) {
                differences += "key '" + key + "' has array length mismatch: expected size = " + expectedValue.length + " actual size = " + actualValue.length + "\n";
            } else {
                for (var i = 0; i < expectedValue.length; i++) {
                    var internalOutput = internalJsonDiff(actualValue[i], expectedValue[i], key + "[" + i + "]");
                    differences += internalOutput.differences;
                }
            }
        }
    }

    return {
        equals : differences === "",
        differences : differences
    }
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) : null;
}

var accentColor = getComputedStyle(document.documentElement).getPropertyValue('--ghost-accent-color');

document.documentElement.style.setProperty('--ghost-accent-color-rgb', hexToRgb(accentColor.replace(' ', '')));

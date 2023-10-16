export const calculateTotalValuesRecursive = (jsonData: any) => {
  if (!jsonData.children || jsonData.children.length === 0) {
    return jsonData.value;
  }
  let total = 0;
  for (let i = 0; i < jsonData.children.length; i++) {
    total = total + calculateTotalValuesRecursive(jsonData.children[i]);
  }
  jsonData.value = total;
  return total;
};

export const scaleValues = (userInputHours: number | null, jsonData: any) => {
  if (userInputHours == null) return;
  const scalingFactor = userInputHours / jsonData.value;
  scaleValuesRecursive(scalingFactor, jsonData);
  return jsonData;
};

const scaleValuesRecursive = (scalingFactor: number, jsonData: any) => {
  if (!jsonData.children || jsonData.children.length === 0) {
    jsonData.value = Math.round(jsonData.value * scalingFactor);
    return jsonData;
  }
  for (let i = 0; i < jsonData.children.length; i++) {
    let chapter = jsonData.children[i];
    scaleValuesRecursive(scalingFactor, chapter);
  }
};

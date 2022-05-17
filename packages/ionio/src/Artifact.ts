import fs from 'fs';

export interface Parameter {
  name: string;
  type: string;
}

export interface Requirement {
  type: 'input' | 'output' | 'after' | 'older';
  value: Input | Output | number;
}

export interface Input {
  hash: string;
  index: number;
  script: string;
  value: number;
  asset: string;
}

export interface Output {
  script: string;
  value: number;
  asset: string;
  nonce: string;
}

export interface Function {
  name: string;
  parameters: Parameter[];
  require: Requirement[];
  asm: string[];
}

export interface Artifact {
  contractName: string;
  functions: Function[];
  //constructorInputs: AbiInput[];
}

export function importArtifact(artifactFile: string): Artifact {
  return JSON.parse(fs.readFileSync(artifactFile, { encoding: 'utf-8' }));
}

export function exportArtifact(artifact: Artifact, targetFile: string): void {
  const jsonString = JSON.stringify(artifact, null, 2);
  fs.writeFileSync(targetFile, jsonString);
}

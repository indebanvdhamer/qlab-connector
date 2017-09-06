module.exports = {
  i: {
    reader: 'readInt32',
    writer: 'writeInt32'
  },
  h: {
    reader: 'readInt64',
    writer: 'writeInt64'
  },
  f: {
    reader: 'readFloat32',
    writer: 'writeFloat32'
  },
  s: {
    reader: 'readString',
    writer: 'writeString'
  },
  S: {
    reader: 'readString',
    writer: 'writeString'
  },
  b: {
    reader: 'readBlob',
    writer: 'writeBlob'
  },
  t: {
    reader: 'readTimeTag',
    writer: 'writeTimeTag'
  },
  T: {
    reader: 'readTrue'
  },
  F: {
    reader: 'readFalse'
  },
  N: {
    reader: 'readNull'
  },
  I: {
    reader: 'readImpulse'
  },
  d: {
    reader: 'readFloat64',
    writer: 'writeFloat64'
  },
  c: {
    reader: 'readChar32',
    writer: 'writeChar32'
  },
  r: {
    reader: 'readColor',
    writer: 'writeColor'
  },
  m: {
    reader: 'readMIDIBytes',
    writer: 'writeMIDIBytes'
  },
};

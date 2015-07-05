var kB = 1024,
	mB = kB * 1024,
	gB = mB * 1024,
	tB = gB * 1024;

function bytesToBits(bytes) {
	return bytes * 8;
}

function bitsToBytes(bits) {
	return bits / 8;
}

module.exports = {
	bytesToBits: bytesToBits,
	bitsToBytes: bitsToBytes,
	kB: kB,
	mB: mB,
	gB: gB,
	tB: tB
};
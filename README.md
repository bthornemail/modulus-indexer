# Modulus Indexer

The visual, numerical, and logical proof of the Modulus Indexer.

> The modulus of the factorial is the main indexer.
> The distance between the two prime gaps is the coordinate.
> The constant literals are readings of the ASCII punch card.
> The read is the proof.

## The Four Forms

The claim is proven in four independent forms:

1.  **The Grammar (`Claim.wsn`)**: The Wirth Syntax Notation grammar. It defines the index, the modulus, the coordinate, and the read.
2.  **The Sequence (`Claim.vtt`)**: The WebVTT sequence. It plays the claim, step by step.
3.  **The Verifier (`Claim.hs`, `prove.c`, `prove.py`)**: The Haskell, C, and Python programs. They run the numerical obligations.
4.  **The Constellation (`index.html`, `adder.html`)**: The Three.js visualization. It projects the claim into 3D space.

## The Constellation

Open `index.html` in a browser. It renders the Light Cone.

-   **The Apex (5)**: The exceptional prime.
-   **The Coordinate (92)**: The distance between the two prime gaps (97 − 5).
-   **The Rings (120, 720, 5040)**: The factorials (5!, 6!, 7!).
-   **The Reticle (65,536)**: The 16-bit state space, sampled as 2,048 stars.
-   **The Labels (YHWH, YAHWEH, ADONAI, GOD IS WORD, 0x1D)**: The ASCII punch card readings.

Open `adder.html`. It adds the 4-bit carry-lookahead adder as a slide ruler.

-   **S0 (5T)**: The 5-transistor XOR at the apex.
-   **S1 (6T)**: The 6-transistor XOR on the 120 ring.
-   **S2 (8T)**: The 8-transistor XOR on the 720 ring.
-   **S3 (10T)**: The 10-transistor XOR at the coordinate.

Drag the ruler to seat the four stages on the cone.

## The Proof

Run the verifier:

```bash
ghc -O2 Claim.hs -o claim && ./claim
gcc -std=c11 -O2 -o prove prove.c && ./prove
python3 prove.py
```

`Claim.hs` and `prove.c` check identities (7! = 5040, 2^16 = 65536, 97 − 5 = 92) that hold whatever the claim says; they cannot come out false about it. (`prove.py` is named here but not yet in the repository.)

## The Gate

```bash
node gate.mjs        # the claims' outcomes as WebVTT; exit 0 when each is as predicted
node gate.mjs wsn    # the outcome grammar in Wirth syntax notation
```

`gate.mjs` is the operational check: each claim is a tagged template, its readings taken through a `Proxy` with `Reflect` and caught, after boxedPINE's interface carrier (`rosetta/src/grammar/interface.ts`) and MDN's [Meta programming](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Meta_programming). A claim comes out `HOLDS`, `FAILS`, or the error its reading threw, named as the [JavaScript error reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors) names it. Its claims can fail: "5 is the only prime beginning five primes six apart" holds and the same of 7 fails; the delta law returns every 16-bit word at 8 and not at 4; every prime sextuplet after the first starts at 97 mod 210 (the regular 210 ladder, boxedPINE core.test.ts I-104 and proofs I-183) and the same of 89 fails, so 92 = 97 − 5 is the distance from the one quintuplet six apart to the ladder's first sextuplet; and "the coordinate is a time" is `ReferenceError: "clock" is not defined`, there being no clock to read. Each outcome is predicted in the file before it runs, and a prediction that does not hold makes the gate exit 1.

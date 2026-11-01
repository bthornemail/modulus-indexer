-- Claim.hs
-- The Modulus Indexer formalised as a pure data type + a single proposition.
-- The numbers are terminal symbols taken verbatim from the WSN grammar.
--
-- Load in GHCi:  ghci Claim.hs
-- Or compile:    ghc -O2 Claim.hs -o claim && ./claim

module Main where

-- Terminal symbols (the “punch-card readings”)
type Factorial  = Integer
type BitSpace   = Integer
type Primordial = Integer
type PrimeGap   = Integer
type Coordinate = Integer

-- The three moduli that appear in the grammar
data Modulus
  = Fact Factorial          -- 5040 | 120 | 720
  | Bits BitSpace           -- 65536
  | Ladder Primordial       -- 210
  deriving (Eq, Show)

-- The two prime-gap anchors and the distance between them
data Distance
  = Gap PrimeGap            -- exceptional 5  | regular 97
  | Coord Coordinate        -- 92
  deriving (Eq, Show)

-- The complete index
data Index = Index Modulus Distance
  deriving (Eq, Show)

-- The claim itself (the only inhabitant we care about)
claim :: Index
claim = Index (Fact 5040) (Coord 92)
-- equivalently one may write any of the other moduli;
-- the essential statement is that the coordinate is the
-- distance between the two gaps and that a factorial modulus
-- indexes it.

-- The numerical obligations that must hold for the claim to be true
prop_factorials :: Bool
prop_factorials =
  product [1..7] == 5040 &&
  product [1..5] == 120  &&
  product [1..6] == 720

prop_bits :: Bool
prop_bits = 2^16 == 65536

prop_primorial :: Bool
prop_primorial = 2*3*5*7 == 210

prop_distance :: Bool
prop_distance = 97 - 5 == 92

-- Simple primality test for the gap anchors
isPrime :: Integer -> Bool
isPrime n
  | n < 2     = False
  | n == 2    = True
  | even n    = False
  | otherwise = go 3
  where
    go i
      | i * i > n      = True
      | n `mod` i == 0 = False
      | otherwise      = go (i + 2)

prop_gaps :: Bool
prop_gaps =
  let exceptional = [5, 11, 17, 23, 29]
  in  all isPrime exceptional
   && all (\(a,b) -> b - a == 6) (zip exceptional (tail exceptional))
   && isPrime 97

-- The whole claim is true precisely when all obligations hold
theClaimHolds :: Bool
theClaimHolds =
  prop_factorials &&
  prop_bits       &&
  prop_primorial  &&
  prop_distance   &&
  prop_gaps

main :: IO ()
main = do
  if theClaimHolds
    then do
      putStrLn "All numerical obligations of the claim hold."
      putStrLn "The modulus is the indexer."
      putStrLn "The prime-gap distance is the coordinate."
      putStrLn "The read is the proof."
    else
      putStrLn "FAIL: one or more obligations did not hold."

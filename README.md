# sparameters-json
Convert s2p file to json file

Works on properly formatted s2p files. File must end with a .s2p extension.

There are simple checks for a properly formatted s2p file.

There is a *params* object that contains: 
* freqUnits (Hz, MHz, GHz)
* networkType (S, Z, Y)
* dataFormat (dB, ma, ri)
* systemImpedance (50, 75, etc)
* numPorts (2)

The *frequency* list is the next object.

Each s-parameter is split into an *a* and a *b* object. The *a* object holds the magnitude or real part. The *b* object holds the angle or imaginary part.

// STATE LAYER
import { useState } from "react";
import { createContext } from "react";

export const SongContext = createContext();

export const SongContextProvider = ({ children}) => {

    const [song, setSong] = useState({
      url: "https://ik.imagekit.io/samguptta/cohort/-2/modify/songs/Kaun_Thagwa__From__Jaaiye_Aap_Kahan_Jaayenge___3A2qA5gxA.mp3",
      posterUrl: "https://ik.imagekit.io/samguptta/cohort-2/moodify/posters/Kaun_Thagwa__From__Jaaiye_Aap_Kahan_Jaayenge___7Xvctu894.jpeg",
      title: 'Kaun Thagwa (From "Jaaiye Aap Kahan Jaayenge")',
      mood: "happy",
    });

    const [loading, setLoading] = useState(false);

    return (
      <SongContext.Provider value={{ loading, setLoading, song, setSong }}>
        {children}
      </SongContext.Provider>
    );


}
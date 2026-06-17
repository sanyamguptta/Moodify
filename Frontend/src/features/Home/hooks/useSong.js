// hook's layer 
import { getSong } from "../service/song.api"; // importing file calling getSong() api
import { useContext } from "react";
import { SongContext } from "../song.context"; // importing all states from state layer file

export const useSong = () => {

    const context = useContext(SongContext);

    const { loading, setLoading, song, setSong } = context;

    // function for calling getSong api
    async function handleGetSong({mood}) {
        setLoading(true);
        const data = await getSong({mood}); // this api returns a particular song of a mood received from req.query
        setSong(data.song);
        setLoading(false);
    }

    return ({
        loading,
        song,
        handleGetSong
    })

}



import React, { useState, useRef, useEffect, useMemo } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Slider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  LinearProgress,
  Paper,
  Divider,
  Avatar,
  Chip,
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import RepeatIcon from '@mui/icons-material/Repeat'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import { useAppSelector } from '../../store/hook'

interface Song {
  id: number
  title: string
  artist: string
  album: string
  duration: number
  cover?: string
  src: string
}

interface UCIMusicEntry {
  uuid: string
  sectionType: string
  sectionName: string
  fileName: string
  values: {
    id: number
    title: string
    artist: string
    album: string
    duration: number
    cover: string
    src: string
  }
  lastModified: string
}

function Music() {
  const uciMusic = useAppSelector((state) => state.uci?.music?.song)

  // Transform UCI data to component format
  const playlist = useMemo(() => {
    if (!uciMusic) return []

    return Object.values(uciMusic).map((entry: UCIMusicEntry) => ({
      id: entry.values.id,
      title: entry.values.title.replace(/'/g, ''), // Remove quotes
      artist: entry.values.artist.replace(/'/g, ''),
      album: entry.values.album.replace(/'/g, ''),
      duration: entry.values.duration,
      cover: entry.values.cover,
      src: entry.values.src,
    }))
  }, [uciMusic])

  const [currentSong, setCurrentSong] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
      audioRef.current.src = playlist[currentSong].src
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentSong, isPlaying, volume, isMuted, playlist])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      if (repeat) {
        setCurrentTime(0)
        audio.currentTime = 0
        audio.play()
      } else {
        handleNext()
      }
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentSong, repeat])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleNext = () => {
    if (shuffle) {
      setCurrentSong(Math.floor(Math.random() * playlist.length))
    } else {
      setCurrentSong((prev) => (prev + 1) % playlist.length)
    }
    setCurrentTime(0)
  }

  const handlePrevious = () => {
    if (currentTime > 10) {
      setCurrentTime(0)
      if (audioRef.current) {
        audioRef.current.currentTime = 0
      }
    } else {
      setCurrentSong((prev) => (prev - 1 + playlist.length) % playlist.length)
      setCurrentTime(0)
    }
  }

  const handleSeek = (value: number) => {
    setCurrentTime(value)
    if (audioRef.current) {
      audioRef.current.currentTime = value
    }
  }

  const handleSongSelect = (index: number) => {
    setCurrentSong(index)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const handleVolumeChange = (value: number) => {
    const newVolume = value / 100
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    if (value === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0
    }
  }

  const currentSongData = playlist[currentSong]
  const progressPercent = (currentTime / currentSongData.duration) * 100

  return (
    <Box sx={{ p: 3 }}>
      <audio ref={audioRef} />
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Music Player
      </Typography>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' } }}>
        {/* Now Playing */}
        <Card elevation={3}>
          <CardContent sx={{ textAlign: 'center' }}>
            {/* Album Cover */}
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                mx: 'auto', 
                mb: 3,
                fontSize: '4rem',
                bgcolor: 'primary.main'
              }}
            >
              {currentSongData.cover || <MusicNoteIcon fontSize="large" />}
            </Avatar>

            {/* Song Info */}
            <Typography variant="h5" gutterBottom>
              {currentSongData.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {currentSongData.artist}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {currentSongData.album}
            </Typography>

            {/* Progress Bar */}
            <Box sx={{ mb: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={progressPercent}
                sx={{ height: 6, borderRadius: 3, mb: 1 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption">
                  {formatTime(currentTime)}
                </Typography>
                <Typography variant="caption">
                  {formatTime(currentSongData.duration)}
                </Typography>
              </Box>
            </Box>

            {/* Seek Slider */}
            <Slider
              value={currentTime}
              max={currentSongData.duration}
              onChange={(_, value) => handleSeek(value as number)}
              sx={{ mb: 3 }}
            />

            {/* Control Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 3 }}>
              <IconButton 
                onClick={() => setShuffle(!shuffle)}
                color={shuffle ? 'primary' : 'default'}
              >
                <ShuffleIcon />
              </IconButton>
              
              <IconButton onClick={handlePrevious} size="large">
                <SkipPreviousIcon fontSize="large" />
              </IconButton>
              
              <IconButton 
                onClick={handlePlayPause} 
                size="large"
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
              </IconButton>
              
              <IconButton onClick={handleNext} size="large">
                <SkipNextIcon fontSize="large" />
              </IconButton>
              
              <IconButton 
                onClick={() => setRepeat(!repeat)}
                color={repeat ? 'primary' : 'default'}
              >
                <RepeatIcon />
              </IconButton>
            </Box>

            {/* Volume Control */}
            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={toggleMute} size="small">
                  {isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>
                <Slider
                  value={isMuted ? 0 : volume * 100}
                  onChange={(_, value) => handleVolumeChange(value as number)}
                  max={100}
                  sx={{ flexGrow: 1 }}
                />
                <Typography variant="caption" sx={{ minWidth: 30 }}>
                  {isMuted ? 0 : Math.round(volume * 100)}%
                </Typography>
              </Box>
            </Paper>
          </CardContent>
        </Card>

        {/* Playlist */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <QueueMusicIcon sx={{ mr: 2 }} />
              <Typography variant="h6">
                Playlist
              </Typography>
              <Chip 
                label={`${playlist.length} songs`}
                size="small"
                sx={{ ml: 'auto' }}
              />
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {playlist.map((song, index) => (
                <ListItem 
                  key={song.id}
                  button
                  onClick={() => handleSongSelect(index)}
                  selected={index === currentSong}
                  divider
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    ...(index === currentSong && {
                      bgcolor: 'primary.light',
                      '&:hover': { bgcolor: 'primary.light' }
                    })
                  }}
                >
                  <Avatar sx={{ mr: 2, bgcolor: index === currentSong ? 'primary.main' : 'grey.300' }}>
                    {song.cover || <MusicNoteIcon />}
                  </Avatar>
                  <ListItemText
                    primary={song.title}
                    secondary={`${song.artist} • ${formatTime(song.duration)}`}
                    primaryTypographyProps={{
                      fontWeight: index === currentSong ? 'bold' : 'normal'
                    }}
                  />
                  <ListItemSecondaryAction>
                    {index === currentSong && isPlaying && (
                      <IconButton edge="end" onClick={handlePlayPause}>
                        <PauseIcon />
                      </IconButton>
                    )}
                    {index === currentSong && !isPlaying && (
                      <IconButton edge="end" onClick={handlePlayPause}>
                        <PlayArrowIcon />
                      </IconButton>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default Music
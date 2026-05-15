import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Platform,
  AccessibilityInfo,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, radius, shadows, typography } from '../theme'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_HORIZONTAL_PADDING = 16
const CARD_WIDTH = Math.min(1000, SCREEN_WIDTH - CARD_HORIZONTAL_PADDING * 2)
const IMAGE_HEIGHT = Math.round(CARD_WIDTH * 0.66)

export default function ListingCard({
  images,
  hasVideo,
  hasVirtualTour,
  priceRange,
  bedroomRange,
  title,
  address,
  amenities,
  phoneEnabled,
  contactPhone,
  saved=null,
  onSave=null,
  onUnsave=null,
  onMessage=null,
  onCall=null,
  onPress,
  isOwnerMode = false,
  onEdit,
  onDeactivate,
  onDelete,
  verificationStatus,
  rejectionReason,
  style,
  showAmenities = false,
}) {
  const normalizedImages = Array.isArray(images)
    ? images
        .map((img) => {
          if (!img) return null
          if (typeof img === 'string') return img
          return img.url || (img.path ? normalizeStoragePath(img.path) : null)
        })
        .filter(Boolean)
    : []

  const [index, setIndex] = useState(0)
  const flatRef = useRef(null)

  useEffect(() => {
    setIndex(0)
  }, [images])

  function normalizeStoragePath(path) {
    return path
  }

  const goPrev = () => {
    if (normalizedImages.length === 0) return
    const next = Math.max(0, index - 1)
    setIndex(next)
    flatRef.current?.scrollToIndex({ index: next, animated: true })
  }

  const goNext = () => {
    if (normalizedImages.length === 0) return
    const next = Math.min(normalizedImages.length - 1, index + 1)
    setIndex(next)
    flatRef.current?.scrollToIndex({ index: next, animated: true })
  }

  const handleSaveToggle = () => {
    if (saved) {
      onUnsave && onUnsave()
    } else {
      onSave && onSave()
    }
  }

  const renderImageItem = ({ item }) => {
    if (!item) return null
    return (
      <Image
        source={{ uri: item }}
        style={styles.image}
        resizeMode="cover"
        accessible
        accessibilityLabel={title ? `${title} image` : 'Listing image'}
      />
    )
  }

  const amenitiesText =
    Array.isArray(amenities) && amenities.length > 0 ? amenities.join(', ') : null

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.9 : 1}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      {!isOwnerMode && (onSave || onUnsave) && (
        <TouchableOpacity
          style={styles.favoriteBtnAbsolute}
          onPress={(e) => { e && e.stopPropagation && e.stopPropagation(); handleSaveToggle() }}
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Remove from favourites' : 'Add to favourites'}
          hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}
        >
          <Ionicons name={saved ? 'heart' : 'heart-outline'} size={22} color={saved ? colors.danger : colors.textSecondary} />
        </TouchableOpacity>
      )}
      {isOwnerMode && (
        <View style={styles.badgeAbsoluteContainer} pointerEvents="none">
          {verificationStatus === 'approved' ? (
            <View style={[styles.statusBadge, styles.statusBadgeVerified]}>
              <Text style={styles.statusBadgeText}>Verified</Text>
            </View>
          ) : verificationStatus === 'rejected' ? (
            <View style={[styles.statusBadge, styles.statusBadgeRejected]}>
              <Text style={styles.statusBadgeText}>Rejected</Text>
            </View>
          ) : (
            <View style={[styles.statusBadge, styles.statusBadgePending]}>
              <Text style={styles.statusBadgeText}>Pending Verification</Text>
            </View>
          )}
        </View>
      )}
      {normalizedImages.length > 0 && (
        <View style={styles.imageContainer}>
          <FlatList
            ref={flatRef}
            data={normalizedImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            renderItem={renderImageItem}
            onMomentumScrollEnd={(ev) => {
              const viewSize = ev.nativeEvent.layoutMeasurement.width
              const contentOffset = ev.nativeEvent.contentOffset.x
              const newIndex = Math.floor(contentOffset / viewSize)
              setIndex(newIndex)
            }}
            initialScrollIndex={index}
            getItemLayout={(_, i) => ({ length: CARD_WIDTH, offset: CARD_WIDTH * i, index: i })}
            style={{ width: CARD_WIDTH }}
          />

          {normalizedImages.length > 1 && (
            <>
              <TouchableOpacity
                style={[styles.arrowBtn, styles.leftArrow]}
                onPress={goPrev}
                accessibilityRole="button"
                accessibilityLabel="Previous image"
              >
                <Ionicons name="chevron-back" size={22} color={colors.white} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.arrowBtn, styles.rightArrow]}
                onPress={goNext}
                accessibilityRole="button"
                accessibilityLabel="Next image"
              >
                <Ionicons name="chevron-forward" size={22} color={colors.white} />
              </TouchableOpacity>

              <View style={styles.pagination}>
                {normalizedImages.map((_, i) => (
                  <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
                ))}
              </View>
            </>
          )}

          {(hasVideo || hasVirtualTour) && (
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>
                {hasVideo && 'Video'}
                {hasVideo && hasVirtualTour ? '  |  ' : ''}
                {hasVirtualTour && 'Virtual Tour'}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.titleRow}>
            {title ? <Text style={styles.titleText} numberOfLines={2}>{title}</Text> : null}
            {priceRange ? <Text style={styles.priceText}>{priceRange} Birr</Text> : null}
            {bedroomRange ? <Text style={styles.bedroomText}>{bedroomRange}</Text> : null}
          </View>
        </View>

  {address ? <Text style={styles.addressText} numberOfLines={2}>{address}</Text> : null}

  {showAmenities && amenitiesText ? <Text style={styles.amenitiesText} numberOfLines={2}>{amenitiesText}</Text> : null}

        <View style={styles.actionsRow}>
          {onMessage && contactPhone && onCall && (
            <>
              <TouchableOpacity style={[styles.primaryBtn, styles.splitBtn, { marginRight: spacing.md }]} onPress={onMessage} accessibilityRole="button" accessibilityLabel="Message">
                <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.white} style={{ marginRight: spacing.md }} />
                <Text style={styles.primaryBtnText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryBtn, styles.splitBtn]} onPress={() => onCall(contactPhone)} accessibilityRole="button" accessibilityLabel={`Call ${contactPhone}`}>
                <Ionicons name="call-outline" size={16} color={colors.white} style={{ marginRight: spacing.md }} />
                <Text style={styles.primaryBtnText}>Call</Text>
              </TouchableOpacity>
            </>
          ) }

          {isOwnerMode && (
            <View style={styles.ownerActions}>
              {onEdit ? (
                <TouchableOpacity style={styles.ownerBtn} onPress={onEdit}>
                  <Text style={styles.ownerBtnText}>Edit</Text>
                </TouchableOpacity>
              ) : null}
              {onDeactivate ? (
                <TouchableOpacity style={[styles.ownerBtn, { backgroundColor: colors.background }]} onPress={onDeactivate}>
                  <Text style={[styles.ownerBtnText, { color: colors.textPrimary }]}>Deactivate</Text>
                </TouchableOpacity>
              ) : null}
              {onDelete ? (
                <TouchableOpacity style={[styles.ownerBtn, { backgroundColor: colors.dangerLight }]} onPress={onDelete}>
                  <Text style={[styles.ownerBtnText, { color: colors.danger }]}>Delete</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    position: 'relative',
    marginBottom: spacing.lg,
    alignSelf: 'center',
    ...shadows.sm,
  },
  imageContainer: {
    width: CARD_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: colors.background,
    position: 'relative',
  },
  image: {
    width: CARD_WIDTH,
    height: IMAGE_HEIGHT,
  },
  arrowBtn: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  leftArrow: {
    left: spacing.md,
  },
  rightArrow: {
    right: spacing.md,
  },
  pagination: {
    position: 'absolute',
    bottom: spacing.sm,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: spacing.xs,
  },
  dotActive: {
    backgroundColor: colors.white,
    width: 8,
    height: 8,
  },
  overlay: {
    position: 'absolute',
    left: spacing.md,
    top: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.overlay,
    borderRadius: radius.lg,
  },
  overlayText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  body: {
    paddingTop: spacing.xs,
    paddingRight: spacing.lg,
    paddingBottom: spacing.md,
    paddingLeft: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  priceText: {
    ...typography.h3,
    marginTop: 0,
    marginBottom: spacing.xs,
    alignSelf: 'flex-start',
  },
  saveBtn: {
    padding: spacing.xs,
    marginLeft: spacing.md,
  },
  favoriteBtnAbsolute: {
    position: 'absolute',
    right: spacing.md,
    top: IMAGE_HEIGHT + spacing.sm,
    zIndex: 60,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  titleRow: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    flex: 1,
    flexDirection: 'column',
  },
  bedroomText: {
    ...typography.bodySmall,
    marginBottom: spacing.xs,
  },
  titleText: {
    ...typography.h4,
    marginTop: spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badgeAbsoluteContainer: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 40,
  },
  statusBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    marginRight: spacing.md,
  },
  statusBadgeText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: typography.caption.fontSize,
  },
  statusBadgeVerified: {
    backgroundColor: colors.success,
  },
  statusBadgePending: {
    backgroundColor: colors.accent,
  },
  statusBadgeRejected: {
    backgroundColor: colors.danger,
  },
  rejectionText: {
    color: colors.danger,
    fontSize: typography.caption.fontSize,
    flex: 1,
  },
  addressText: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
  },
  amenitiesText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: 13,
  },
  actionsRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
    marginRight: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: colors.white,
    fontWeight: '700',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    marginRight: spacing.md,
  },
  callBtnText: {
    color: colors.primary,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    marginRight: spacing.md,
  },
  secondaryBtnText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  ownerActions: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  ownerBtn: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    marginLeft: spacing.md,
  },
  ownerBtnText: {
    color: colors.primary,
    fontWeight: '700',
  },
  splitBtn: {
    flex: 1,
  },
})
